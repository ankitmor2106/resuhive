import { useQuery } from '@tanstack/react-query'
import * as analysisService from '@/services/analysis'

export const useATSAnalysis = (resumeId: string) => {
  return useQuery({
    queryKey: ['atsAnalysis', resumeId],
    queryFn: async () => {
      const res = await analysisService.getATSAnalysis(resumeId)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    enabled: !!resumeId,
  })
}
