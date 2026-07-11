import { JDMatch, ApiResponse } from '@/types'
import { apiClient } from './api'

export async function matchJobDescription(resumeId: string, jdText: string): Promise<ApiResponse<JDMatch>> {
  return apiClient<JDMatch>('POST', `/resumes/${resumeId}/analysis/jd-match`, { jobDescription: jdText })
}
