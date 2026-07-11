# AI Resume Platform — Build Specification v4 (Right-Sized)

**Version:** 4.0
**Supersedes:** v3
**Scope:** Builders Program PS1 — Intermediate difficulty, 4 sprints / 3 weeks

**Change summary:** v3 was split across 4 Parts and 12 chunks, generated somewhat independently — which is how the same responsibility (ATS/JD ownership) ended up defined twice, in two different places, two different ways. v4 is one document, so there's exactly one place that owns each decision. It keeps every quality practice from v3 — layering, validation, deterministic scoring, approval-gated AI — and cuts the infrastructure v3 built for a scale this project doesn't have. Default AI provider is now **Gemini**. Two v3 gaps are closed: complete resume section schemas (10/10, was 5/10) and an explicit home for Readability and Grammar in the analysis pipeline.

---

# 1. Vision

The AI Resume Platform helps candidates build ATS-friendly resumes and evaluate them against real job descriptions, using AI only where it adds measurable value on top of a deterministic, testable core.

## Primary Features (v1)
- Resume Builder
- Resume Import
- ATS Analysis
- Job Description Matching
- AI Suggestions
- PDF Export

## Explicitly Out of Scope (v1)

Product scope — unchanged from v3:
- Recruiter Portal
- Team Collaboration
- Mobile App
- Interview Coach
- Multi-tenancy

Infrastructure scope — cut from v3:
- Multi-provider AI abstraction (single provider — Gemini — behind a small interface instead)
- Dedicated worker fleet (parser/ats/jd/ai/export workers) and a queue per feature
- Monorepo with separate `packages/*`
- Immutable resume version history with restore
- Refresh token rotation / reuse detection
- Prometheus, Grafana, OpenTelemetry, formal DR runbooks with RPO/RTO targets
- Coverage-percentage CI gates, full E2E suite, formal WCAG AA audit process

None of the cut items are wrong ideas — they're the right call at a different scale. Nothing here stops you adding any of them back later if this outgrows a graded assignment.

## Product Principles

1. Buildable first
2. Assignment friendly
3. Production **quality**, not production **scale** — type safety, validation, security basics, and a testable deterministic core are non-negotiable; multi-service infrastructure is not
4. Modular architecture — module boundaries live inside one application, not across a fleet of services
5. AI as an assistant, never business logic
6. Provider-independent interface, single provider in v1

---

# 2. Functional Requirements

## Authentication
Register · Login · Refresh · Logout · Forgot/Reset Password · User Profile

## Resume Builder
Create/Edit/Delete · Autosave · Multiple templates · Live preview · Duplicate resume
Edit, delete, and reorder any of the 10 sections (full schemas in §6): Personal Information, Professional Summary, Experience, Education, Projects, Skills, Certifications, Achievements, Positions of Responsibility, Languages, Interests.

## Resume Import
`Upload → Parse → Normalize → Validate → Store`. Supported: PDF, JSON. (DOCX: later.)

## ATS Analysis
Insights required by the brief: ATS compatibility, formatting, missing sections, readability, grammar, resume strength. Full scoring model in §7 — readability and grammar now have an explicit home (this was a gap in v3, closed here).

## Job Description Matching
Outputs: match %, matching skills, missing skills, missing keywords, relevant experience gaps, suggested improvements.

## AI Suggestions
Summary generation · Bullet/section rewrite · Grammar correction · Achievement suggestions.
User approval is always required before any AI output is applied — never auto-applied.

## Resume Export
Printable PDF, matching the live preview exactly.

---

# 3. Non-Functional Requirements

Matched directly to the PS — nothing added:

| Requirement | Target |
|---|---|
| Responsive design | Mobile / tablet / desktop breakpoints |
| Secure authentication | JWT + Argon2id, HTTPS, rate-limited login |
| Efficient data storage | Indexed Postgres, object storage for files |
| Good application performance | API P95 < 500ms · ATS < 5s · Parsing < 10s |
| Clean architecture | Controller → Service → Repository, enforced |
| Maintainable codebase | TypeScript strict, ESLint, no `any` |

Reliability: retry AI/parsing calls a bounded number of times, fail with a clear error state. No formal uptime SLA — that's a live-product concern, not a build-spec one.

---

# 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript |
| Backend | NestJS |
| Database | PostgreSQL + Prisma |
| Cache (optional) | Redis — AI response cache + login rate-limit only |
| AI | Single-provider service, default **Gemini** |
| PDF | Puppeteer |
| Storage | S3 / Cloudflare R2 |

## AI Provider Layer

```text
AIService
 └── GeminiProvider   (implements AIProvider)
```

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=...
```

The interface — `generateSummary`, `rewriteSection`, `improveGrammar`, `generateAchievements`, `semanticMatch` — is provider-agnostic by design, so swapping providers later means writing one new class against the existing interface, not a rearchitecture. Only `GeminiProvider` ships in v1.

---

# 5. Repo & Backend Structure

Two folders. No monorepo tooling, no shared packages to link and version.

```text
resume-platform/
├── frontend/
│   └── src/{app,features,components,hooks,lib,services,stores,types,utils}
├── backend/
│   └── src/{modules,common,config,prisma,main.ts}
├── docs/
└── docker-compose.yml     (Postgres + Redis — local dev only)
```

If a type genuinely needs to cross the frontend/backend boundary, copy it. Don't stand up a shared package for a handful of interfaces.

```text
backend/src/modules/
├── auth/
├── users/
├── resumes/
├── analysis/       ← owns BOTH ATS scoring and JD matching
├── ai/
├── exports/
└── templates/
```

`analysis` is a single module that owns ATS scoring and JD matching end-to-end. There is no separate `ats-worker` or `jd-worker` app — v3 defined both a backend module *and* separate worker apps for the same responsibility; pick one owner, and this is it.

| Module | Responsibility |
|---|---|
| auth | Authentication & JWT |
| users | User profile |
| resumes | Resume CRUD |
| analysis | ATS scoring + JD matching |
| ai | Gemini provider access |
| exports | PDF generation |
| templates | Resume templates |

Rules (unchanged from v3 — these were correct):
- Controllers handle HTTP only.
- Services contain business logic.
- Repositories access Prisma only.
- Forbidden: Controller → Prisma, Controller → Redis, Controller → AI provider, UI → Database.

```text
HTTP Request → Validation → Controller → Service → Repository → Prisma → PostgreSQL
```

---

# 6. Database

## Core Entities

```text
User
 ├── Resume
 │     ├── ATSAnalysis
 │     ├── JDMatch
 │     ├── AISuggestion
 │     └── Export
 └── RefreshToken
```

A user can save multiple resumes, per the PS. There is no `ResumeVersion` entity — each `Resume` is edited and autosaved in place. If you want a safety net without full version history, add a single `previousSnapshot` JSON column that's overwritten on each save (undo-last, not restore-any-version) — optional, and far cheaper than an append-only version table.

Prisma guidelines: UUID primary keys · `createdAt`/`updatedAt` on all entities · soft delete (`deletedAt`) on Resume · enums instead of free-form strings · indexes on `User.email`, `Resume.userId`, `Resume.updatedAt`, `ATSAnalysis.resumeId`, `JDMatch.resumeId`, `Export.resumeId`.

## Resume Section Schemas — complete, 10/10 (5 new in v4)

```json
// Personal Information
{
  "fullName": "", "email": "", "phone": "", "location": "",
  "linkedin": "", "github": "", "portfolio": ""
}
```

```json
// Experience
{
  "company": "", "role": "", "location": "",
  "startDate": "", "endDate": "", "current": false,
  "bullets": []
}
```

```json
// Education
{
  "institution": "", "degree": "", "field": "",
  "startYear": "", "endYear": "", "grade": ""
}
```

```json
// Project
{
  "name": "", "description": "", "technologies": [],
  "repository": "", "demo": ""
}
```

```json
// Skill
{ "category": "", "items": [] }
```

```json
// Certification — new
{
  "name": "", "issuer": "", "issueDate": "",
  "expiryDate": "", "credentialUrl": ""
}
```

```json
// Achievement — new
{ "title": "", "description": "", "date": "", "issuer": "" }
```

```json
// Position of Responsibility — new
{
  "role": "", "organization": "",
  "startDate": "", "endDate": "", "current": false,
  "bullets": []
}
```

```json
// Language — new
{ "name": "", "proficiency": "" }
```

```json
// Interests — new, deliberately unstructured
{ "interests": ["Photography", "Chess", "Marathon Running"] }
```

Interests don't get individual objects — no attribute is worth modeling per-interest, so it's a flat string array on the resume rather than its own child entity. Same reasoning as everywhere else in this doc: model exactly the structure you need, no more.

## Enums

```text
ResumeStatus:        DRAFT | ACTIVE | ARCHIVED
ExportStatus:        PENDING | GENERATING | READY | FAILED
SuggestionType:       SUMMARY | REWRITE | GRAMMAR | ACHIEVEMENT | BULLET
LanguageProficiency:  NATIVE | FLUENT | PROFESSIONAL | INTERMEDIATE | BASIC
```

(`JobStatus` only needed if you add the optional export queue in §8.)

---

# 7. ATS Scoring Engine

Deterministic, rule-based. AI never touches the number — the strongest idea in v3, unchanged here.

## Categories & Weights (Readability added — this closes the v3 gap)

| Category | Weight |
|---|---:|
| Contact Information | 10 |
| Structure | 15 |
| Skills | 15 |
| Experience | 25 |
| Education | 10 |
| Keywords | 15 |
| Readability | 10 |
| **Total** | **100** |

Readability sub-signals (all rule-based, no LLM call):
- Bullet length (flag bullets over ~30 words)
- Passive-voice heuristic (auxiliary verb + past-participle pattern)
- Bullets that don't open with an action verb (checked against a static verb list)
- Average sentence/bullet length across the resume

## Grammar — where it actually lives

v3 tangled two different things together; v4 separates them:
- **Grammar as a reported metric** (part of Resume Analysis, per the PS) → a rule-based grammar/style linter runs during analysis and contributes an issue count. No LLM call, no added latency or cost.
- **Grammar as a fix** (part of AI Suggestions, per the PS) → stays an AI-generated rewrite, shown as a diff, requiring explicit accept before it touches the resume. Unchanged from v3.

## Pipeline

```text
Resume → Validation → Section Analysis → Rule Evaluation → Weighted Score → Recommendations
```

Rules live in a versioned config file, not hardcoded — this is what makes the score auditable and unit-testable. Keep it from v3.

---

# 8. Job Description Matching & Background Jobs

```text
Job Description → Normalize → Extract Skills & Keywords → Compare With Resume → Match Report
```

Outputs: match percentage, matching skills, missing skills, missing keywords, relevant experience gaps *(now listed explicitly — v3 folded this into "suggested improvements")*, suggested improvements.

**Background jobs, minimal.** Run parsing, ATS scoring, JD matching, and AI calls synchronously inside the request-response cycle — your own performance targets (ATS < 5s, parsing < 10s) sit comfortably inside a normal HTTP timeout and don't need a queue to feel responsive.

PDF export is the one candidate for async: start synchronous, and only add a queue if generation time becomes noticeable in testing.

```text
Queue (optional): pdf-export
QUEUED → GENERATING → READY   (or FAILED, max 3 retries)
```

That's the only queue in this spec.

---

# 9. AI Layer

```text
Request Suggestion → Loading → Suggestion Generated → Review (diff view) → Accept or Reject
```

Rules, unchanged from v3: never auto-apply · always show a diff against the original · support undo after accepting.

Response handling: validate every Gemini response is well-formed JSON matching the expected schema before persisting it; reject and surface an error if not. Log provider, latency, and success/failure to normal app logs — a dedicated telemetry pipeline isn't worth building for one provider and one evaluator.

Prompts live in `backend/src/modules/ai/prompts/`, one file per feature (`summary.ts`, `rewrite.ts`, `grammar.ts`, `achievements.ts`). Git history is your prompt versioning — no separate in-app system needed.

---

# 10. API Standards

Unchanged from v3 — already right-sized.

```json
// Success
{ "success": true, "data": {}, "meta": {} }
```
```json
// Error
{ "success": false, "error": { "code": "AI_001", "message": "Provider unavailable" } }
```

REST, JSON, `/api/v1` prefix, consistent pagination.

| Code | Meaning |
|---|---|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Expired token |
| RESUME_001 | Resume not found |
| RESUME_002 | Validation failed |
| PARSER_001 | Unsupported format |
| PARSER_002 | Parsing failed |
| ATS_001 | Analysis failed |
| JD_001 | Invalid job description |
| AI_001 | Provider unavailable |
| AI_002 | Invalid AI response |
| EXPORT_001 | Generation failed |

---

# 11. Authentication

Argon2id password hashing · short-lived access token + longer-lived refresh token (a simple pair — no rotation/reuse-detection ceremony; add it later if this becomes a real product with real accounts to protect) · rate-limited login endpoint · JWT required on protected routes.

| Method | Endpoint |
|---|---|
| POST | /api/v1/auth/register |
| POST | /api/v1/auth/login |
| POST | /api/v1/auth/refresh |
| POST | /api/v1/auth/logout |
| GET | /api/v1/auth/profile |

---

# 12. Frontend

Unchanged in spirit from v3 — this part of the original doc was already right-sized.

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Client state | Zustand — UI-only (theme, builder state, dialogs); never duplicate server state here |

Feature folders: `auth`, `dashboard`, `resume-builder`, `resume-import`, `ats-analysis`, `jd-matching`, `ai-suggestions`, `exports`, `settings`. Components call services, never `fetch()` directly.

Key flows to get right: builder autosave (debounce → PATCH → saved indicator) · drag-to-reorder sections (Personal Information stays first) · ATS dashboard (score + category breakdown + recommendations) · JD match report · AI suggestion review (side-by-side diff, accept/reject).

Baseline accessibility — semantic HTML, visible focus states, keyboard-navigable forms — comes close to free with shadcn/ui and Tailwind. Treat it as a normal quality bar, not a separately audited workstream.

---

# 13. Deployment

```text
Browser → Next.js (Vercel) → NestJS API (Railway / Render / Fly)
                                 ├── PostgreSQL (managed)
                                 ├── Redis (managed, optional)
                                 ├── Object storage (S3 / R2)
                                 └── Gemini API
```

Local dev: `docker-compose.yml` with just Postgres + Redis. Secrets via the platform's env var manager, never committed. Logs via the platform's built-in log viewer; add a free Sentry project if you want error alerting — five minutes of setup, no dedicated observability stack needed.

---

# 14. Testing

Not a coverage-percentage gate — a priority order:

1. **Unit test the ATS engine and JD matcher.** Pure, deterministic functions — cheapest to test, highest value to prove correct.
2. **Integration test the auth and resume CRUD happy paths.**
3. Everything else: manual testing is fine for a 3-week build. Add more automated coverage only if time is left over in week 3.

---

# 15. Build Order (3 weeks)

**Week 1 — Foundation**
DB schema + Prisma · auth (register/login/JWT/refresh) · resume CRUD · builder UI shell with all 10 sections + drag-to-reorder · autosave

**Week 2 — Intelligence**
Resume import/parsing · deterministic ATS engine (7 categories incl. readability) · JD matching · Gemini-backed AI suggestions (summary/rewrite/grammar/achievements) with accept/reject UI

**Week 3 — Polish & ship**
PDF export · 2–3 well-designed templates · responsive pass · unit tests on ATS/JD logic · deploy · README

---

# 16. Definition of Done

A feature is done when: it works end-to-end on the happy path, inputs are validated, errors show a human-readable message, it follows the controller/service/repository layering, and — for ATS scoring and JD matching specifically — it has a passing unit test.
