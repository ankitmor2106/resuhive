// ============================================================
// API Envelope — matches backend spec exactly
// ============================================================
export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: Record<string, unknown>
}

export interface ApiError {
  success: false
  error: { code: string; message: string }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ============================================================
// Enums
// ============================================================
export type ResumeStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
export type ExportStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED'
export type SuggestionType = 'SUMMARY' | 'REWRITE' | 'GRAMMAR' | 'ACHIEVEMENT' | 'BULLET'
export type LanguageProficiency = 'NATIVE' | 'FLUENT' | 'PROFESSIONAL' | 'INTERMEDIATE' | 'BASIC'
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected'

// ============================================================
// Resume Sections
// ============================================================
export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  dateOfBirth?: string
  linkedin?: string
  github?: string
  portfolio?: string
  photoUrl?: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  startYear: string
  endYear: string
  grade?: string
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  technologies: string[]
  repository?: string
  demo?: string
}

export interface SkillGroup {
  id: string
  category: string
  items: string[]
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
}

export interface AchievementEntry {
  id: string
  title: string
  description: string
  date: string
  issuer?: string
}

export interface PositionEntry {
  id: string
  role: string
  organization: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface LanguageEntry {
  id: string
  name: string
  proficiency: LanguageProficiency
}

export interface CustomSection {
  title: string
  content: string
}

export interface ResumeTheme {
  primaryColor?: string;
  fontFamily?: string;
  spacing?: 'compact' | 'normal' | 'relaxed';
  customLayout?: 'single-column' | 'two-column-left' | 'two-column-right';
  customHeader?: 'centered' | 'left-aligned' | 'side-by-side';
  customBackground?: 'solid' | 'subtle-grid' | 'dots' | 'gradient'; // Legacy
  backgroundColor?: string;
  textColor?: string;
}

// ============================================================
// Resume
// ============================================================
export interface Resume {
  id: string
  title: string
  status: ResumeStatus
  templateId: string
  personalInfo: PersonalInfo
  professionalSummary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  skills: SkillGroup[]
  certifications: CertificationEntry[]
  achievements: AchievementEntry[]
  positions: PositionEntry[]
  languages: LanguageEntry[]
  interests: string[]
  custom?: CustomSection
  theme?: ResumeTheme
  /** Reorderable; 'personalInfo' is always index 0 and locked */
  sectionOrder: string[]
  updatedAt: string
  createdAt: string
}

// ============================================================
// Analysis
// ============================================================
export interface ATSCategory {
  name: string
  weight: number
  score: number
  issues: string[]
}

export interface ATSAnalysis {
  resumeId: string
  overallScore: number
  categories: ATSCategory[]
  recommendations: string[]
  createdAt: string
}

export interface JDMatch {
  resumeId: string
  matchPercentage: number
  matchingSkills: string[]
  missingSkills: string[]
  missingKeywords: string[]
  experienceGaps: string[]
  suggestedImprovements: string[]
}

export interface AISuggestion {
  id: string
  type: SuggestionType
  targetSectionId: string
  original: string
  suggested: string
  status: SuggestionStatus
}

// ============================================================
// Auth
// ============================================================
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName: string // Computed property on frontend
  authProvider: 'EMAIL' | 'GOOGLE'
  hasPassword?: boolean
  dateOfBirth?: string
  occupation?: string
  experience?: string
  skills?: string[]
  profileCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// ============================================================
// Export
// ============================================================
export interface ExportJob {
  id: string
  resumeId: string
  status: ExportStatus
  format: 'PDF' | 'DOCX'
  url?: string
  createdAt: string
}
