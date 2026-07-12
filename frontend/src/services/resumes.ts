import { Resume, ApiResponse } from '@/types'
import { apiClient } from './api'

const DEFAULT_RESUME_STRUCTURE = {
  templateId: 'classic',
  personalInfo: { fullName: '', email: '', phone: '', location: '' },
  professionalSummary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  positions: [],
  languages: [],
  interests: [],
  sectionOrder: [
    'personalInfo',
    'professionalSummary',
    'experience',
    'education',
    'skills',
  ],
}

function sanitizeResume(resume: any): Resume {
  return {
    ...DEFAULT_RESUME_STRUCTURE,
    ...resume,
    personalInfo: resume.personalInfo || DEFAULT_RESUME_STRUCTURE.personalInfo,
    experience: resume.experience || [],
    education: resume.education || [],
    projects: resume.projects || [],
    skills: resume.skills || [],
    certifications: resume.certifications || [],
    achievements: resume.achievements || [],
    positions: resume.positions || [],
    languages: resume.languages || [],
    interests: resume.interests || [],
    sectionOrder: resume.sectionOrder || DEFAULT_RESUME_STRUCTURE.sectionOrder,
  }
}

export async function listResumes(): Promise<ApiResponse<Resume[]>> {
  const res = await apiClient<Resume[]>('GET', '/resumes')
  if (res.success) {
    res.data = res.data.map(sanitizeResume)
  }
  return res
}

export async function getResume(id: string): Promise<ApiResponse<Resume>> {
  const res = await apiClient<Resume>('GET', `/resumes/${id}`)
  if (res.success) {
    res.data = sanitizeResume(res.data)
  }
  return res
}

export async function createResume(data: Partial<Resume>): Promise<ApiResponse<Resume>> {
  const res = await apiClient<Resume>('POST', '/resumes', data)
  if (res.success) {
    res.data = sanitizeResume(res.data)
  }
  return res
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<ApiResponse<Resume>> {
  const res = await apiClient<Resume>('PATCH', `/resumes/${id}`, data)
  if (res.success) {
    res.data = sanitizeResume(res.data)
  }
  return res
}

export async function deleteResume(id: string): Promise<ApiResponse<null>> {
  return apiClient<null>('DELETE', `/resumes/${id}`)
}

export async function cleanupAiSuggestions(id: string): Promise<ApiResponse<{ success: boolean, deletedCount: number }>> {
  return apiClient<{ success: boolean, deletedCount: number }>('POST', `/resumes/${id}/cleanup-suggestions`)
}

export async function duplicateResume(id: string): Promise<ApiResponse<Resume>> {
  const res = await apiClient<Resume>('POST', `/resumes/${id}/duplicate`)
  if (res.success) {
    res.data = sanitizeResume(res.data)
  }
  return res
}

export async function importResumeFromPdf(file: File): Promise<ApiResponse<Resume>> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient<Resume>('POST', '/resumes/import', formData)
  if (res.success) {
    res.data = sanitizeResume(res.data)
  }
  return res
}

export async function importResumeFromFile(file: File): Promise<ApiResponse<Resume>> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient<Resume>('POST', '/resumes/import', formData)
  if (res.success) {
    res.data = sanitizeResume(res.data)
  }
  return res
}
