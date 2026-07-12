import { DeterministicCategoryResult } from '../analyzers/types';

export function rankByImpact(
  categories: Record<string, any>,
  weights: Record<string, number>
) {
  return Object.entries(categories)
    .map(([key, result]) => ({
      key,
      impact: (weights[key] ?? 0) * (100 - result.score),
      ...result,
    }))
    .sort((a, b) => b.impact - a.impact);
}
