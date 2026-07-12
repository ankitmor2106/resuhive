import { z } from 'zod';

export const CategoryAssessmentSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const RecruiterSnapshotSchema = z.object({
  firstImpression: z.string(),
  strengths: z.array(z.string()).min(1).max(4),
  watchOuts: z.array(z.string()).min(1).max(4),
});

export const ATSLLMOutputSchema = z.object({
  professionalSummary: CategoryAssessmentSchema,
  workExperience: CategoryAssessmentSchema,
  skillsKeywords: CategoryAssessmentSchema,
  formattingStructure: CategoryAssessmentSchema,
  impactReadability: CategoryAssessmentSchema,
  projects: CategoryAssessmentSchema.optional(),
  recruiterSnapshot: RecruiterSnapshotSchema,
});
export type ATSLLMOutput = z.infer<typeof ATSLLMOutputSchema>;

export const RequirementMatchSchema = z.object({
  requirement: z.string(),
  category: z.enum(['technical', 'soft_skill', 'experience', 'education', 'certification', 'tool', 'responsibility']),
  priority: z.enum(['required', 'preferred']),
  status: z.enum(['matched', 'partial', 'missing']),
  note: z.string(),
});
export type RequirementMatch = z.infer<typeof RequirementMatchSchema>;

export const JDLLMOutputSchema = z.object({
  seniority: z.string(),
  industry: z.string(),
  requirements: z.array(RequirementMatchSchema),
  gaps: z.array(z.string()),
  improvements: z.array(z.string()),
});
export type JDLLMOutput = z.infer<typeof JDLLMOutputSchema>;
