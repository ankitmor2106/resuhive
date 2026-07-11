"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  id: string
  title: string
  isLocked?: boolean
  children: React.ReactNode
  isExpanded?: boolean
  onToggle?: () => void
}

export function SectionEditorWrapper({ id, title, isLocked = false, children, isExpanded: controlledExpanded, onToggle }: SectionWrapperProps) {
  const [localExpanded, setLocalExpanded] = useState(!isLocked)
  
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setLocalExpanded(!localExpanded)
    }
  }
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isLocked })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "mb-4 overflow-hidden transition-colors border-mist shadow-sm",
        isDragging && "opacity-50 ring-2 ring-pine border-transparent shadow-lg"
      )}
    >
      <div 
        className="flex items-center bg-secondary/30 px-2 py-2 border-b border-border cursor-pointer transition-colors hover:bg-secondary/50"
        onClick={handleToggle}
      >
        {!isLocked && (
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-secondary rounded-md mr-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Drag to reorder ${title} section`}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              // Let dnd-kit handle the drag, but don't toggle the section
              e.stopPropagation();
              if (listeners?.onPointerDown) {
                listeners.onPointerDown(e as any);
              }
            }}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        {isLocked && <div className="w-8 ml-2" />}
        
        <div className="flex-1 font-semibold text-sm">
          {title}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="sr-only">Toggle {title}</span>
        </Button>
      </div>
      
      {isExpanded && (
        <CardContent className="p-4 pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  )
}
