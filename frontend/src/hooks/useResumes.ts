import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as resumesService from '@/services/resumes'
import { Resume } from '@/types'

export const useResumes = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await resumesService.listResumes()
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
  })
}

export const useResume = (id: string) => {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const res = await resumesService.getResume(id)
      if (!res.success) throw new Error(res.error.message)
      const data = res.data
      const defaultSections = ['personalInfo', 'professionalSummary', 'experience', 'education', 'projects', 'skills', 'custom']
      if (!data.sectionOrder || data.sectionOrder.length === 0) {
        data.sectionOrder = defaultSections
      } else {
        const missing = defaultSections.filter(s => !data.sectionOrder.includes(s))
        if (missing.length > 0) {
          data.sectionOrder = [...data.sectionOrder, ...missing]
        }
      }
      return data
    },
    enabled: !!id,
  })
}

export const useCreateResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Resume>) => {
      const res = await resumesService.createResume(data)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })
}

export const useUpdateResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Resume> }) => {
      const res = await resumesService.updateResume(id, data)
      if (!res.success) throw new Error(res.error.message)
      const resData = res.data
      const defaultSections = ['personalInfo', 'professionalSummary', 'experience', 'education', 'projects', 'skills', 'custom']
      if (!resData.sectionOrder || resData.sectionOrder.length === 0) {
        resData.sectionOrder = defaultSections
      } else {
        const missing = defaultSections.filter(s => !resData.sectionOrder.includes(s))
        if (missing.length > 0) {
          resData.sectionOrder = [...resData.sectionOrder, ...missing]
        }
      }
      return resData
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['resume', id] })

      // Snapshot the previous value
      const previousResume = queryClient.getQueryData<Resume>(['resume', id])

      // Optimistically update to the new value
      queryClient.setQueryData(['resume', id], (old: any) => {
        if (!old) return old
        
        const newData = { ...old }
        for (const key of Object.keys(data)) {
          const typedKey = key as keyof Resume
          if (typeof data[typedKey] === 'object' && !Array.isArray(data[typedKey]) && data[typedKey] !== null) {
            newData[typedKey] = { ...old[typedKey], ...data[typedKey] }
          } else {
            newData[typedKey] = data[typedKey]
          }
        }
        return newData
      })

      // Return a context object with the snapshotted value
      return { previousResume }
    },
    onError: (err, variables, context) => {
      // Revert to previous value on error
      if (context?.previousResume) {
        queryClient.setQueryData(['resume', variables.id], context.previousResume)
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })
}

export const useDeleteResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await resumesService.deleteResume(id)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.removeQueries({ queryKey: ['resume', id] })
    },
  })
}

export const useDuplicateResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await resumesService.duplicateResume(id)
      if (!res.success) throw new Error(res.error.message)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })
}
