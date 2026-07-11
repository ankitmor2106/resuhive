"use client"

import React, { use } from "react"
import { useResume, useUpdateResume } from "@/hooks/useResumes"
import { useRouter } from "next/navigation"
import { TEMPLATES, dummyResumeData } from "@/lib/templates"
import { LivePreview } from "@/components/resume/LivePreview"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, CheckCircle2, Search, ZoomIn } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ResumeTheme } from "@/types"

export default function ChooseTemplatePage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = use(params)
  const { data: resume, isLoading } = useResume(resumeId)
  const updateResume = useUpdateResume()
  const router = useRouter()

  const handleChooseTemplate = (templateId: string) => {
    updateResume.mutate(
      { id: resumeId, data: { templateId } },
      {
        onSuccess: () => {
          router.push(`/resume/${resumeId}/builder`)
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="w-[300px] h-[400px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const previewResume = {
    ...dummyResumeData,
    ...(resume || {}),
    personalInfo: {
      ...dummyResumeData.personalInfo,
      ...(resume?.personalInfo || {})
    },
    experience: (resume?.experience && resume.experience.length > 0) ? resume.experience : dummyResumeData.experience,
    education: (resume?.education && resume.education.length > 0) ? resume.education : dummyResumeData.education,
    skills: (resume?.skills && resume.skills.length > 0) ? resume.skills : dummyResumeData.skills,
    projects: (resume?.projects && resume.projects.length > 0) ? resume.projects : dummyResumeData.projects,
    professionalSummary: resume?.professionalSummary || dummyResumeData.professionalSummary,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/resume/${resumeId}/builder`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Builder
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Current Template: <span className="font-semibold text-foreground">{TEMPLATES.find(t => t.id === resume?.templateId)?.name || 'Classic'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Templates we recommend for you</h1>
          <p className="text-lg text-slate-600">You can always change your template later.</p>
        </div>



        <div className="mb-6 text-sm font-medium text-slate-500">
          Showing <span className="text-slate-900">{TEMPLATES.length}</span> templates
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {TEMPLATES.map((t) => {
            const isActive = resume?.templateId === t.id;
            
            return (
              <div 
                key={t.id} 
                className={`group relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${isActive ? 'ring-2 ring-primary shadow-lg ring-offset-4' : 'shadow-md border border-slate-200 hover:border-primary/50'}`}
              >
                {t.recommended && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md shadow-sm border border-blue-200">
                      Recommended
                    </span>
                  </div>
                )}
                
                {/* Visual Preview Container */}
                <div className="relative aspect-[1/1.2] w-full overflow-hidden rounded-t-2xl bg-slate-100 p-4">
                  <div className="absolute inset-0 flex justify-center items-start pt-6">
                    <div 
                      className="bg-white shadow-sm"
                      style={{ 
                        width: '850px', 
                        height: '1100px', 
                        transform: 'scale(0.3)', 
                        transformOrigin: 'top center',
                        pointerEvents: 'none'
                      }}
                    >
                      <LivePreview resume={{ ...previewResume, templateId: t.id }} />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-16 h-16 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-slate-700 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                {/* Footer details */}
                <div className="p-5 flex flex-col flex-1 border-t border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-1">{t.desc}</p>
                  
                  <Button 
                    onClick={() => handleChooseTemplate(t.id)} 
                    variant={isActive ? "outline" : "default"}
                    className={`w-full font-semibold rounded-xl h-12 transition-all ${isActive ? 'border-primary text-primary hover:bg-primary/5' : 'bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5'}`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Current Template
                      </>
                    ) : (
                      "Choose template"
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
