"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useCreateExport, useExportStatus } from "@/hooks/useExports"
import { useResume } from "@/hooks/useResumes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, Printer, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { PrintDialog } from "@/components/resume/PrintDialog"

export default function ExportPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const unwrappedParams = React.use(params)
  const resumeId = unwrappedParams.resumeId
  const { data: resume, isLoading: isLoadingResume } = useResume(resumeId)
  const createExport = useCreateExport()
  
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const { data: jobStatus } = useExportStatus(resumeId, activeJobId)

  // Simulated server export
  const handleExport = (format: 'PDF' | 'DOCX') => {
    createExport.mutate({ resumeId, format }, {
      onSuccess: (data) => setActiveJobId(data.id)
    })
  }


  const getProgress = () => {
    if (!jobStatus) return 0
    if (jobStatus.status === 'PENDING') return 25
    if (jobStatus.status === 'GENERATING') return 60
    if (jobStatus.status === 'READY') return 100
    return 0
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8 h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Export Resume</h1>
        <p className="text-muted-foreground">Download your resume as a high-quality PDF.</p>
      </div>

      <div className="max-w-md mx-auto w-full">
        <Card className="flex flex-col border-pine/20 hover:border-pine/50 transition-colors shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-pine/10 flex items-center justify-center rounded-full mb-4">
              <Download className="h-6 w-6 text-pine" />
            </div>
            <CardTitle className="text-xl">Generate PDF</CardTitle>
            <CardDescription className="text-sm">
              This will open your browser's print dialog. For the best result, ensure <strong>"Background graphics"</strong> is checked and margins are set to <strong>"None"</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-8">
            {resume ? (
              <PrintDialog resume={resume} trigger={
                <Button className="w-full h-12 text-md bg-pine text-white hover:bg-pine/90" disabled={isLoadingResume}>
                  <Printer className="mr-2 h-5 w-5" /> Download / Print PDF
                </Button>
              } />
            ) : (
              <Button className="w-full h-12 text-md bg-pine text-white hover:bg-pine/90" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading Resume...
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
