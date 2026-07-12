import { ATSLLMOutput } from '../../ai/response-validator';
import { DeterministicCategoryResult } from '../analyzers/types';
import { getWeightProfile } from './weight-provider';
import { resolveWeights } from './score-normalizer';
import { interpretLlmCategories } from '../analyzers/llm-category.interpreter';

export interface ATSResult {
  totalScore: number;
  profile: string;
  categories: Record<string, any>;
  recruiterSnapshot: any;
}

export function combineATSScore(
  llmOutput: ATSLLMOutput,
  contactInformation: DeterministicCategoryResult,
  education: DeterministicCategoryResult,
  profileId: string = 'default'
): ATSResult {
  const hasProjects = !!llmOutput.projects;
  const profile = getWeightProfile(profileId);
  const weights = resolveWeights(profile, hasProjects);

  const { categories: llmCategories, recruiterSnapshot } = interpretLlmCategories(llmOutput);

  const categories: Record<string, any> = {
    contactInformation,
    education,
    ...llmCategories,
  };

  let totalScore = 0;
  for (const key of Object.keys(weights)) {
    if (categories[key]) {
      totalScore += categories[key].score * weights[key];
    }
  }

  return { 
    totalScore: Math.round(totalScore), 
    profile: profile.id, 
    categories,
    recruiterSnapshot
  };
}
