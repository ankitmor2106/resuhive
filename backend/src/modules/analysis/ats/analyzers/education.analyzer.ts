import { DeterministicCategoryResult } from './types';

export function scoreEducation(resume: any): DeterministicCategoryResult {
  const education = resume.education || [];
  const certifications = resume.certifications || [];
  
  if (education.length > 0) {
    return { score: 100, issues: [] };
  }
  
  if (certifications.length > 0) {
    return { score: 50, issues: ['No formal education listed, but certifications present.'] };
  }
  
  return { score: 0, issues: ['No education or certifications listed.'] };
}
