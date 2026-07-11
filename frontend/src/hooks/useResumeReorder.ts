import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Resume } from '@/types'

export function useResumeReorder(resumeId: string) {
  const queryClient = useQueryClient()

  const optimisticReorder = (newOrder: string[]) => {
    queryClient.setQueryData<Resume>(['resume', resumeId], (old) => {
      if (!old) return old
      return { ...old, sectionOrder: newOrder }
    })
  }

  return { optimisticReorder }
}
