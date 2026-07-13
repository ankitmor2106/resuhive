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
import { exportToTxt, exportToDocx } from "@/lib/exportUtils"

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
              Print or save as a variable-length, multi-page PDF.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className="flex flex-col shadow-sm border-mist">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-lg">Word Document</CardTitle>
              <CardDescription className="text-xs">Export to an editable .docx file</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => resume && exportToDocx(resume)}
                disabled={!resume || isLoadingResume}
              >
                <FileText className="mr-2 h-4 w-4" /> Download DOCX
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col shadow-sm border-mist">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-lg">Plain Text</CardTitle>
              <CardDescription className="text-xs">Export to a simple .txt file</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => resume && exportToTxt(resume)}
                disabled={!resume || isLoadingResume}
              >
                <FileText className="mr-2 h-4 w-4" /> Download TXT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
