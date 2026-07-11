import { ExportJob, ApiResponse } from '@/types'
import { apiClient } from './api'

export async function createExport(resumeId: string, format: 'PDF' | 'DOCX'): Promise<ApiResponse<ExportJob>> {
  // Currently the backend only supports PDF export via `POST /resumes/:resumeId/export`
  return apiClient<ExportJob>('POST', `/resumes/${resumeId}/export`)
}

export async function getExportStatus(resumeId: string, id: string): Promise<ApiResponse<ExportJob>> {
  return apiClient<ExportJob>('GET', `/resumes/${resumeId}/export/${id}`)
}
