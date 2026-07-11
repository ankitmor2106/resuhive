import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as jdMatchService from '@/services/jdMatch'

export const useJDMatch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ resumeId, jdText }: { resumeId: string; jdText: string }) => {
      const res = await jdMatchService.matchJobDescription(resumeId, jdText)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['jdMatch', variables.resumeId], data)
    },
  })
}
