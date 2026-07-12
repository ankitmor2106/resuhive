import { ATSLLMOutput } from '../../ai/response-validator';

export function interpretLlmCategories(llmOutput: ATSLLMOutput) {
  const categories: Record<string, any> = {
    professionalSummary: llmOutput.professionalSummary,
    workExperience: llmOutput.workExperience,
    skillsKeywords: llmOutput.skillsKeywords,
    formattingStructure: llmOutput.formattingStructure,
    impactReadability: llmOutput.impactReadability,
  };

  if (llmOutput.projects) {
    categories.projects = llmOutput.projects;
  }

  return {
    categories,
    recruiterSnapshot: llmOutput.recruiterSnapshot,
  };
}
