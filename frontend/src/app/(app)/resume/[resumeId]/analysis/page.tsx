"use client"

import * as React from "react"
import { useATSAnalysis } from "@/hooks/useAnalysis"
import { useResume } from "@/hooks/useResumes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeightedMeter } from "@/components/ats/WeightedMeter"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, TrendingUp, Info, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalysisPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const unwrappedParams = React.use(params)
  const resumeId = unwrappedParams.resumeId
  const router = useRouter()
  const { data: resume, isLoading: isLoadingResume } = useResume(resumeId)
  const { data: analysis, isLoading: isLoadingAnalysis } = useATSAnalysis(resumeId)

  if (isLoadingResume || isLoadingAnalysis) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">ATS Analysis</h1>
        <p className="text-muted-foreground text-sm">
          Scoring for <span className="font-semibold text-foreground">{resume?.title}</span>
        </p>
      </div>

      {/* Main Score Card */}
      <Card className="border-pine/20 overflow-hidden">
        <div className="bg-pine/5 p-6 border-b border-border flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">Overall ATS Score</CardTitle>
            <CardDescription className="text-base max-w-md">
              This score represents how well your resume matches standard Applicant Tracking System parsers.
            </CardDescription>
          </div>
          <div className="flex items-center justify-center shrink-0">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                <circle
                  className="text-pine/20 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-pine stroke-current"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - analysis.overallScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="flex flex-col items-center z-10">
                <span className="font-system text-4xl font-bold text-pine">{analysis.overallScore}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">/ 100</span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">Score Breakdown by Weight</h3>
          <WeightedMeter categories={analysis.categories} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ochre" />
              Recommendations
            </CardTitle>
            <CardDescription>Actionable steps to improve your score.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="mt-0.5 rounded-full bg-ochre/10 p-1">
                    <Info className="h-4 w-4 text-ochre" />
                  </div>
                  <span className="text-sm leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Category Details */}
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>Specific issues found during parsing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysis.categories.map(cat => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between items-center border-b border-mist pb-1">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <span className="font-system text-xs font-semibold" style={{ color: cat.score >= 80 ? 'hsl(var(--pine))' : cat.score >= 60 ? 'hsl(var(--ochre))' : 'hsl(var(--brick))'}}>
                      {cat.score}/100
                    </span>
                  </div>
                  {cat.issues.length === 0 ? (
                    <div className="flex items-center text-sm text-pine mt-1">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Looking good
                    </div>
                  ) : (
                    <ul className="space-y-1 mt-1">
                      {cat.issues.map((issue, i) => (
                        <li key={i} className="flex items-start text-sm text-muted-foreground">
                          <AlertCircle className="h-3.5 w-3.5 mr-2 mt-0.5 shrink-0 text-brick" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
