import { WeightProfile } from '../../config/weights.config';

const PROJECTS_WEIGHT_WHEN_PRESENT = 0.10;

export function resolveWeights(profile: WeightProfile, hasProjects: boolean): Record<string, number> {
  if (!hasProjects) {
    return profile.weights as Record<string, number>;
  }

  const shrink = 1 - PROJECTS_WEIGHT_WHEN_PRESENT;
  const resolved: Record<string, number> = { projects: PROJECTS_WEIGHT_WHEN_PRESENT };
  
  for (const [key, weight] of Object.entries(profile.weights)) {
    resolved[key] = (weight as number) * shrink;
  }
  
  return resolved;
}
