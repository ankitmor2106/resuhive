import { useState, useEffect, useRef } from 'react'
import { useUpdateResume } from './useResumes'
import { Resume } from '@/types'
import { useQueryClient } from '@tanstack/react-query'

export function useAutosave(resumeId: string) {
  const queryClient = useQueryClient()
  const updateResume = useUpdateResume()
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const lastSavedRef = useRef<string>('')

  const mutateFnRef = useRef(updateResume.mutate)
  mutateFnRef.current = updateResume.mutate

  const save = (data: Partial<Resume>) => {
    const stringified = JSON.stringify(data)
    if (stringified === lastSavedRef.current) return

    setSavingState('saving')
    
    // Optimistically update local cache instantly so UI doesn't lag
    queryClient.setQueryData(['resume', resumeId], (old: any) => {
      if (!old) return old;
      const newData = { ...old };
      for (const key of Object.keys(data)) {
        const typedKey = key as keyof Resume;
        if (typeof data[typedKey] === 'object' && !Array.isArray(data[typedKey]) && data[typedKey] !== null) {
          newData[typedKey] = { ...old[typedKey], ...data[typedKey] };
        } else {
          newData[typedKey] = data[typedKey];
        }
      }
      return newData;
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      mutateFnRef.current(
        { id: resumeId, data },
        {
          onSuccess: () => {
            setSavingState('saved')
            lastSavedRef.current = stringified
            setTimeout(() => {
              setSavingState((prev) => (prev === 'saved' ? 'idle' : prev))
            }, 2000)
          },
          onError: () => {
            setSavingState('idle')
          },
        }
      )
    }, 1500)
  }

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { save, savingState }
}
