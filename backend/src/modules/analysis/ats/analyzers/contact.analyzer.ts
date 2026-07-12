import { DeterministicCategoryResult } from './types';
import { EMAIL_RE, URL_RE } from '../../utils/regex';

export function scoreContactInformation(resume: any): DeterministicCategoryResult {
  let score = 0;
  const issues: string[] = [];
  
  if (!resume.personalInfo) {
    return { score: 0, issues: ['No contact information provided'] };
  }

  const { email, phone, fullName, location, linkedin, github, portfolio } = resume.personalInfo;

  if (email && EMAIL_RE.test(email)) {
    score += 25;
  } else {
    issues.push('Missing or invalid email address');
  }

  if (phone) {
    score += 25;
  } else {
    issues.push('Missing phone number');
  }

  if (fullName) {
    score += 20;
  } else {
    issues.push('Missing full name');
  }

  if (location) {
    score += 10;
  } else {
    issues.push('Missing location');
  }

  if (linkedin && URL_RE.test(linkedin)) {
    score += 10;
  } else {
    issues.push('Missing or invalid LinkedIn URL');
  }

  if ((github && URL_RE.test(github)) || (portfolio && URL_RE.test(portfolio))) {
    score += 10;
  }

  return { score, issues };
}
