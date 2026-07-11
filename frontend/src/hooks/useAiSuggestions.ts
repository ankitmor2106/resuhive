import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as aiSuggestionsService from '@/services/aiSuggestions'

export const useAISuggestions = (resumeId: string, sectionId: string, type: string | null, data: any) => {
  return useQuery({
    queryKey: ['aiSuggestions', resumeId, sectionId, type, data],
    queryFn: async () => {
      if (!type) return [];
      const res = await aiSuggestionsService.getSuggestions(resumeId, sectionId, type, data)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    enabled: !!resumeId && !!sectionId && !!type,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useAcceptSuggestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ resumeId, id }: { resumeId: string; id: string }) => {
      const res = await aiSuggestionsService.acceptSuggestion(resumeId, id)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (data, variables) => {
      queryClient.setQueriesData({ queryKey: ['aiSuggestions'] }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((s: any) => s.id !== variables.id);
      })
    },
  })
}

export const useRejectSuggestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ resumeId, id }: { resumeId: string; id: string }) => {
      const res = await aiSuggestionsService.rejectSuggestion(resumeId, id)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (data, variables) => {
      queryClient.setQueriesData({ queryKey: ['aiSuggestions'] }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((s: any) => s.id !== variables.id);
      })
    },
  })
}
