"use client"

import { Button } from "@/components/ui/button"
import { AISuggestion } from "@/types"
import { Check, X, Undo2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SuggestionDiffProps {
  suggestion: AISuggestion
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onUndo?: (id: string) => void
}

export function SuggestionDiff({ suggestion, onAccept, onReject, onUndo }: SuggestionDiffProps) {
  const [isAccepted, setIsAccepted] = useState(suggestion.status === 'accepted')
  const [isRejected, setIsRejected] = useState(suggestion.status === 'rejected')

  const handleAccept = () => {
    setIsAccepted(true)
    onAccept(suggestion.id)
  }

  const handleReject = () => {
    setIsRejected(true)
    onReject(suggestion.id)
  }

  const handleUndo = () => {
    setIsAccepted(false)
    setIsRejected(false)
    if (onUndo) onUndo(suggestion.id)
  }

  if (isRejected) {
    return null // Could also render a tiny "rejected" stub if needed
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="rounded-md border border-[hsl(var(--ochre)/0.3)] bg-[hsl(var(--ochre)/0.08)] p-3 mb-3"
      >
        <div className="flex flex-col gap-2 text-sm">
          {suggestion.original && (
            <div className="text-muted-foreground line-through decoration-muted-foreground/50">
              {suggestion.original}
            </div>
          )}
          
          <div className="text-foreground decoration-[hsl(var(--ochre))] underline underline-offset-2">
            {suggestion.suggested}
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-2">
            {isAccepted ? (
              <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground" onClick={handleUndo}>
                <Undo2 className="mr-1 h-3 w-3" />
                Undo
              </Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-destructive" onClick={handleReject}>
                  <X className="mr-1 h-3 w-3" />
                  Discard
                </Button>
                <Button size="sm" variant="ai" className="h-7 px-3" onClick={handleAccept}>
                  <Check className="mr-1 h-3 w-3" />
                  Accept
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
