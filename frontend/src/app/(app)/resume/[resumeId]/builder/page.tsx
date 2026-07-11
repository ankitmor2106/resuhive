"use client"

import Link from "next/link"
import * as React from "react"
import { useResume, useUpdateResume } from "@/hooks/useResumes"
import { useBuilderStore } from "@/stores/builderStore"
import { useAutosave } from "@/hooks/useAutosave"
import { ResumeForms } from "@/components/resume/ResumeForms"
import { LivePreview } from "@/components/resume/LivePreview"
import { AISuggestionPanel } from "@/components/ai/AISuggestionPanel"
import { PrintDialog } from "@/components/resume/PrintDialog"
import { ThemeEditor } from "@/components/resume/ThemeEditor"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { FileText, LayoutTemplate, Printer, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useState } from "react"
import { TEMPLATES } from "@/lib/templates"

export default function BuilderPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const unwrappedParams = React.use(params)
  const resumeId = unwrappedParams.resumeId
  const { data: resume, isLoading } = useResume(resumeId)
  const updateResume = useUpdateResume()
  const { activeTab, setActiveTab, setDragActive } = useBuilderStore()
  const { save, savingState } = useAutosave(resumeId)
  
  // Need local state for optimistic reorder
  const [orderedSections, setOrderedSections] = useState<string[]>([])
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)

  useEffect(() => {
    if (resume?.sectionOrder) {
      setOrderedSections(resume.sectionOrder)
    }
  }, [resume?.sectionOrder])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = () => {
    setDragActive(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setDragActive(false)
      // personalInfo cannot be moved
      if (active.id === 'personalInfo' || over.id === 'personalInfo') return

      const oldIndex = orderedSections.indexOf(active.id as string)
      const newIndex = orderedSections.indexOf(over.id as string)
      
      const newOrder = arrayMove(orderedSections, oldIndex, newIndex)
      setOrderedSections(newOrder)
      
      // Persist the order
      updateResume.mutate({ id: resumeId, data: { sectionOrder: newOrder } })
    }
  }



  if (isLoading || !resume) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  // Override resume.sectionOrder with local state for smooth drag
  const currentResume = { ...resume, sectionOrder: orderedSections }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Topbar inside Builder */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            defaultValue={resume.title}
            className="font-semibold bg-transparent border-0 focus:ring-0 text-lg w-[200px] sm:w-[300px] outline-none"
            onBlur={(e) => {
              if (e.target.value !== resume.title) {
                updateResume.mutate({ id: resume.id, data: { title: e.target.value } })
              }
            }}
          />
          <div className="hidden sm:flex items-center text-xs text-muted-foreground font-system">
            {savingState === 'saving' && <span className="animate-pulse">Saving...</span>}
            {savingState === 'saved' && <span className="text-pine flex items-center"><CheckCircle2 className="h-3 w-3 mr-1"/> Saved</span>}
            {savingState === 'idle' && <span>All changes saved</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit'|'preview')} className="w-[160px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Link href={`/resume/${resumeId}/choose-template`}>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Template: {resume.templateId || 'classic'}
            </Button>
          </Link>
          <PrintDialog resume={currentResume} trigger={
            <Button size="sm" className="hidden sm:flex gap-2">
              <Printer className="h-4 w-4" />
              Export
            </Button>
          } />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop Split */}
        <div className="hidden lg:block h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={45} minSize={30} className="bg-background">
              <div className="h-full flex flex-col">
                <Tabs defaultValue="content" className="flex-1 flex flex-col min-h-0">
                  <div className="px-6 pt-4 border-b border-border bg-muted/20 shrink-0">
                    <TabsList className="grid w-full max-w-sm grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="theme">Customize</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="content" className="flex-1 overflow-y-auto p-6 m-0">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                      <SortableContext items={orderedSections} strategy={verticalListSortingStrategy}>
                        <ResumeForms resume={currentResume} resumeId={resume.id} save={save} />
                      </SortableContext>
                    </DndContext>
                  </TabsContent>
                  <TabsContent value="theme" className="flex-1 overflow-y-auto p-6 m-0">
                    <ThemeEditor resume={currentResume} updateResume={updateResume} />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} className="bg-paper flex items-center justify-center p-8 overflow-y-auto">
              <div className="w-full max-w-[850px] shadow-2xl transition-all duration-300 transform origin-top my-auto">
                <LivePreview resume={currentResume} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden h-full overflow-hidden">
          {activeTab === 'edit' ? (
            <div className="h-full bg-background pb-20 flex flex-col">
              <Tabs defaultValue="content" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 pt-2 border-b border-border bg-muted/20 shrink-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="theme">Customize</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="content" className="flex-1 overflow-y-auto p-4 m-0">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <SortableContext items={orderedSections} strategy={verticalListSortingStrategy}>
                      <ResumeForms resume={currentResume} resumeId={resume.id} save={save} />
                    </SortableContext>
                  </DndContext>
                </TabsContent>
                <TabsContent value="theme" className="flex-1 overflow-y-auto p-4 m-0">
                  <ThemeEditor resume={currentResume} updateResume={updateResume} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4 bg-paper pb-20">
              <LivePreview resume={currentResume} />
            </div>
          )}
        </div>
      </div>

      <AISuggestionPanel resumeId={resume.id} />
    </div>
  )
}
