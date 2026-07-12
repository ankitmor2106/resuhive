import { createHash } from 'crypto';

export function contentHash(...parts: string[]): string {
  return createHash('sha256').update(parts.join('|')).digest('hex');
}

export const atsCacheKey = (resumeVersionId: string, templateId: string) =>
  `ats:${contentHash(resumeVersionId, templateId)}`;

export const jdCacheKey = (resumeVersionId: string, jdText: string) =>
  `jd:${contentHash(resumeVersionId, contentHash(jdText))}`;
