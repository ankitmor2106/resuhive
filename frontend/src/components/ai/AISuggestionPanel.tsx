"use client"

import { useAISuggestions, useAcceptSuggestion, useRejectSuggestion } from "@/hooks/useAiSuggestions"
import { SuggestionDiff } from "./SuggestionDiff"
import { useBuilderStore } from "@/stores/builderStore"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AISuggestionPanelProps {
  resumeId: string
}

export function AISuggestionPanel({ resumeId }: AISuggestionPanelProps) {
  const { aiPanelOpen, setAiPanelOpen, activeSectionId, aiContextType, aiContextData } = useBuilderStore()
  
  // We use activeSectionId to fetch targeted suggestions
  const { data: suggestions, isLoading, isError, error, refetch } = useAISuggestions(resumeId, activeSectionId || '', aiContextType, aiContextData)
  
  const acceptMut = useAcceptSuggestion()
  const rejectMut = useRejectSuggestion()

  const pendingSuggestions = suggestions?.filter(s => s.status === 'pending') || []

  const handleAccept = (id: string) => {
    const suggestion = suggestions?.find(s => s.id === id);
    if (suggestion) {
      window.dispatchEvent(new CustomEvent('ai-suggestion-accepted', {
        detail: {
          sectionId: suggestion.targetSectionId,
          suggestedText: suggestion.suggested,
          type: suggestion.type
        }
      }));
      if (suggestion.type !== 'ACHIEVEMENT') {
        setAiPanelOpen(false);
      }
    }
    acceptMut.mutate({ resumeId, id });
  };

  return (
    <Sheet open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
      <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--ochre))]" />
            AI Suggestions
          </SheetTitle>
          <SheetDescription>
            Review AI suggestions for your active section.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          {!activeSectionId && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Select a section to see suggestions.
            </div>
          )}

          {activeSectionId && isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-[hsl(var(--ochre))]" />
              <p className="text-sm">Analyzing content...</p>
            </div>
          )}

          {activeSectionId && isError && (
            <div className="flex flex-col items-center justify-center py-8 text-destructive text-center">
              <p className="text-sm font-medium mb-2">Failed to load suggestions</p>
              <p className="text-xs opacity-80 mb-4">{error?.message || "An error occurred while talking to AI"}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="border-destructive/20 hover:bg-destructive/10">
                Try Again
              </Button>
            </div>
          )}

          {activeSectionId && !isLoading && !isError && pendingSuggestions.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              No suggestions at this time. Looking good!
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs h-7">
                  <Sparkles className="h-3 w-3 mr-1" /> Generate New Suggestion
                </Button>
              </div>
            </div>
          )}

          {activeSectionId && !isLoading && !isError && pendingSuggestions.map((suggestion) => (
            <SuggestionDiff
              key={suggestion.id}
              suggestion={suggestion}
              onAccept={handleAccept}
              onReject={(id) => rejectMut.mutate({ resumeId, id })}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
