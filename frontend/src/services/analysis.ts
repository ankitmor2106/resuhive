import { ATSAnalysis, ApiResponse } from '@/types'
import { apiClient } from './api'

export async function getATSAnalysis(resumeId: string): Promise<ApiResponse<ATSAnalysis>> {
  return apiClient<ATSAnalysis>('POST', `/resumes/${resumeId}/analysis/ats`)
}
