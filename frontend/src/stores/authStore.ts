import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  setCurrentUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
}))
