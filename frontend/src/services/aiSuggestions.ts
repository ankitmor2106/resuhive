import { AISuggestion, SuggestionType, ApiResponse } from '@/types'
import { apiClient } from './api'

export async function getSuggestions(resumeId: string, sectionId: string, type: string, data?: any): Promise<ApiResponse<AISuggestion[]>> {
  // Pass sectionId as part of the data body. The backend expects { type, data }.
  return apiClient<AISuggestion[]>('POST', `/resumes/${resumeId}/suggestions`, { type, data: { sectionId, ...data } })
}

export async function acceptSuggestion(resumeId: string, id: string): Promise<ApiResponse<AISuggestion>> {
  return apiClient<AISuggestion>('PATCH', `/resumes/${resumeId}/suggestions/${id}/accept`)
}

export async function rejectSuggestion(resumeId: string, id: string): Promise<ApiResponse<AISuggestion>> {
  return apiClient<AISuggestion>('PATCH', `/resumes/${resumeId}/suggestions/${id}/reject`)
}
