"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { z } from "zod"
import * as resumesService from "@/services/resumes"

const stepMap = {
  idle: 0,
  uploading: 25,
  parsing: 50,
  normalizing: 75,
  validating: 90,
  saved: 100,
}

type Step = keyof typeof stepMap

export default function ResumeImportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExtensions = ['pdf', 'json', 'txt', 'doc', 'docx']
    if (!allowedExtensions.includes(ext)) {
      setError("Please upload a PDF, JSON, TXT, or DOC/DOCX file.")
      return
    }

    try {
      setError(null)
      
      if (ext === 'json') {
        // Handle JSON exactly as requested
        setStep('uploading')
        await new Promise(r => setTimeout(r, 500))
        
        setStep('parsing')
        const text = await file.text()
        const data = JSON.parse(text)
        await new Promise(r => setTimeout(r, 500))
        
        setStep('normalizing')
        await new Promise(r => setTimeout(r, 500))
        
        setStep('validating')
        // We'd use a real Zod schema here. For now, simple check.
        if (!data.personalInfo || !data.title) {
          throw new Error("Invalid resume format.")
        }
        await new Promise(r => setTimeout(r, 500))
        
        setStep('saved')
        // Create it
        const res = await resumesService.createResume(data)
        if (!res.success) throw new Error(res.error.message)
        
        setTimeout(() => router.push(`/resume/${res.data.id}/builder`), 1000)
        
      } else {
        // PDF, TXT, DOC, DOCX flow through mock service
        setStep('uploading')
        await new Promise(r => setTimeout(r, 800))
        
        setStep('parsing')
        const res = await resumesService.importResumeFromFile(file)
        if (!res.success) throw new Error(res.error.message)
        
        setStep('normalizing')
        await new Promise(r => setTimeout(r, 500))
        
        setStep('validating')
        await new Promise(r => setTimeout(r, 500))
        
        setStep('saved')
        setTimeout(() => router.push(`/resume/${res.data.id}/builder`), 1000)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during import.")
      setStep('idle')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const isProcessing = step !== 'idle' && step !== 'saved'

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Import Resume</h1>
        <p className="text-muted-foreground">Upload your existing resume to get started quickly.</p>
      </div>

      <Card className="border-dashed border-2 overflow-hidden bg-card/50">
        <CardContent className="p-12">
          {step === 'idle' || error ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-pine/10 text-pine rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drag and drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm">
                Supports PDF, JSON, TXT, and DOC/DOCX formats. Parsing might take a few moments to extract your information.
              </p>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="application/pdf,application/json,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
              
              <Button onClick={() => fileInputRef.current?.click()} size="lg">
                Select File
              </Button>
              
              {error && (
                <div className="mt-6 flex items-center text-sm text-brick bg-brick/10 px-4 py-2 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              {step === 'saved' ? (
                <div className="h-16 w-16 bg-pine/10 text-pine rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8" />
                </div>
              ) : (
                <div className="h-16 w-16 bg-ochre/10 text-ochre rounded-full flex items-center justify-center mb-6">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {step === 'saved' ? 'Import Complete' : `${step}...`}
              </h3>
              
              <div className="w-full max-w-md mt-6">
                <Progress value={stepMap[step]} className="h-2 mb-2" />
                <div className="flex justify-between text-xs font-system text-muted-foreground">
                  <span>Uploading</span>
                  <span>Parsing</span>
                  <span>Validating</span>
                  <span>Done</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
