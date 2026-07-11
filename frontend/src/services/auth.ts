import { User, AuthTokens, ApiResponse } from '@/types'
import { apiClient } from './api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export async function login(email: string, password: string): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
  const response = await apiClient<{ user: User; tokens: AuthTokens }>('POST', '/auth/login', { email, password })
  
  if (response.success && response.data.tokens) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth_token', response.data.tokens.accessToken)
    }
  }
  
  if (response.success && response.data.user) {
    response.data.user.fullName = [response.data.user.firstName, response.data.user.lastName].filter(Boolean).join(' ') || ''
  }
  
  return response
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  dateOfBirth?: string
  occupation?: string
  experience?: string
  skills?: string[]
}

export async function register(data: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
  const parts = data.fullName.trim().split(' ')
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || ''
  
  const response = await apiClient<{ user: User; tokens: AuthTokens }>('POST', '/auth/register', {
    firstName,
    lastName,
    email: data.email,
    password: data.password,
    dateOfBirth: data.dateOfBirth || undefined,
    occupation: data.occupation || undefined,
    experience: data.experience || undefined,
    skills: data.skills?.length ? data.skills : undefined,
  })
  
  if (response.success && response.data.tokens) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth_token', response.data.tokens.accessToken)
      window.localStorage.removeItem('MOCK_LOGGED_OUT')
    }
  }
  
  return response
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  if (typeof window !== 'undefined' && !window.localStorage.getItem('auth_token')) {
    return { success: false, error: { code: 'AUTH_003', message: 'Not authenticated' } }
  }
  const res = await apiClient<User>('GET', '/auth/me')
  if (res.success && res.data) {
    res.data.fullName = [res.data.firstName, res.data.lastName].filter(Boolean).join(' ') || ''
  }
  return res
}

export async function logout(): Promise<ApiResponse<null>> {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('auth_token')
    window.localStorage.setItem('MOCK_LOGGED_OUT', 'true')
  }
  return { success: true, data: null }
}

export async function forgotPassword(email: string): Promise<ApiResponse<null>> {
  return apiClient<null>('POST', '/auth/forgot-password', { email })
}

export async function resetPassword(password: string, token: string): Promise<ApiResponse<null>> {
  return apiClient<null>('POST', '/auth/reset-password', { password, token })
}

export async function updateProfile(fullName: string, email: string, dateOfBirth?: string, occupation?: string, experience?: string, skills?: string[]): Promise<ApiResponse<User>> {
  const parts = fullName.trim().split(' ')
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || ''
  const res = await apiClient<User>('PUT', '/auth/profile', { firstName, lastName, email, dateOfBirth, occupation, experience, skills })
  if (res.success && res.data) {
    res.data.fullName = [res.data.firstName, res.data.lastName].filter(Boolean).join(' ') || ''
  }
  return res
}

export async function updatePassword(currentPassword: string | undefined, newPassword: string): Promise<ApiResponse<null>> {
  return apiClient<null>('PUT', '/auth/password', { currentPassword, newPassword })
}

export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`
}
