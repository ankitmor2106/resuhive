import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as exportsService from '@/services/exports'

export const useCreateExport = () => {
  return useMutation({
    mutationFn: async ({ resumeId, format }: { resumeId: string; format: 'PDF' | 'DOCX' }) => {
      const res = await exportsService.createExport(resumeId, format)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
  })
}

export const useExportStatus = (resumeId: string | null, jobId: string | null) => {
  return useQuery({
    queryKey: ['exportStatus', resumeId, jobId],
    queryFn: async () => {
      if (!jobId || !resumeId) return null
      const res = await exportsService.getExportStatus(resumeId, jobId)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    enabled: !!jobId && !!resumeId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'READY' || data.status === 'FAILED')) {
        return false
      }
      return 2000
    },
  })
}
