import { RequirementMatch } from '../ai/response-validator';

export function toLegacyShape(requirements: RequirementMatch[]) {
  return {
    matchingSkills: requirements.filter((r) => r.status === 'matched').map((r) => r.requirement),
    partialSkills: requirements.filter((r) => r.status === 'partial').map((r) => r.requirement),
    missingSkills: requirements.filter((r) => r.status === 'missing').map((r) => r.requirement),
  };
}
