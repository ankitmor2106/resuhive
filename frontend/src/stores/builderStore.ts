import { create } from 'zustand'

interface BuilderState {
  activeTab: 'edit' | 'preview'
  activeSectionId: string | null
  aiPanelOpen: boolean
  dragActive: boolean
  aiContextType: 'SUMMARY' | 'ACHIEVEMENT' | 'REWRITE' | null
  aiContextData: any
  setActiveTab: (tab: 'edit' | 'preview') => void
  setActiveSectionId: (id: string | null) => void
  setAiPanelOpen: (open: boolean) => void
  setDragActive: (active: boolean) => void
  setAiContextType: (type: 'SUMMARY' | 'ACHIEVEMENT' | 'REWRITE' | null) => void
  setAiContextData: (data: any) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  activeTab: 'edit',
  activeSectionId: null,
  aiPanelOpen: false,
  dragActive: false,
  aiContextType: null,
  aiContextData: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveSectionId: (id) => set({ activeSectionId: id }),
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
  setDragActive: (active) => set({ dragActive: active }),
  setAiContextType: (type) => set({ aiContextType: type }),
  setAiContextData: (data) => set({ aiContextData: data }),
}))
