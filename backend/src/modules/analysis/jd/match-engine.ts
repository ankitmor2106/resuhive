import { RequirementMatch } from '../ai/response-validator';

export function computeMatchPercentage(requirements: RequirementMatch[]): number | null {
  if (requirements.length === 0) return null;
  const statusValue = { matched: 1, partial: 0.5, missing: 0 } as const;
  const priorityWeight = { required: 2, preferred: 1 } as const;
  
  let earned = 0, possible = 0;
  for (const r of requirements) {
    const w = priorityWeight[r.priority];
    earned += statusValue[r.status] * w;
    possible += w;
  }
  return Math.round((earned / possible) * 100);
}

export function computeMatchByCategory(requirements: RequirementMatch[]): Record<string, number | null> {
  const byCategory = new Map<string, RequirementMatch[]>();
  for (const r of requirements) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category)!.push(r);
  }
  const result: Record<string, number | null> = {};
  for (const [category, reqs] of byCategory) result[category] = computeMatchPercentage(reqs);
  return result;
}

export function mergeGaps(llmGaps: string[], resume: any): string[] {
  const gaps = [...llmGaps];
  const experience = resume.experience || [];
  if (experience.length === 0 && !gaps.some((g) => /work experience/i.test(g))) {
    gaps.unshift('No work experience listed on the resume.');
  }
  return gaps;
}
