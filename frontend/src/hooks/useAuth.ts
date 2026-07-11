import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authService from '@/services/auth'
import { useAuthStore } from '@/stores/authStore'
import { User } from '@/types'

export const useCurrentUser = () => {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser)
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await authService.getCurrentUser()
      if (!res.success) throw new Error(res.error.message)
      setCurrentUser(res.data)
      return res.data
    },
    retry: false,
  })
}

export const useLogin = () => {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await authService.login(email, password)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (data) => {
      setCurrentUser(data.user)
      queryClient.setQueryData(['currentUser'], data.user)
    },
  })
}

export const useRegister = () => {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: authService.RegisterData) => {
      const res = await authService.register(data)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (data) => {
      setCurrentUser(data.user)
      queryClient.setQueryData(['currentUser'], data.user)
    },
  })
}

export const useLogout = () => {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await authService.logout()
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: () => {
      setCurrentUser(null)
      queryClient.setQueryData(['currentUser'], null)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('MOCK_LOGGED_OUT', 'true')
      }
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await authService.forgotPassword(email)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ password, token }: { password: string; token: string }) => {
      const res = await authService.resetPassword(password, token)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
  })
}

export const useUpdateProfile = () => {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { fullName: string; email: string; dateOfBirth?: string; occupation?: string; experience?: string; skills?: string[] }) => {
      const res = await authService.updateProfile(data.fullName, data.email, data.dateOfBirth, data.occupation, data.experience, data.skills)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (data) => {
      setCurrentUser(data)
      queryClient.setQueryData(['currentUser'], data)
    },
  })
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword?: string; newPassword: string }) => {
      const res = await authService.updatePassword(currentPassword, newPassword)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
  })
}
