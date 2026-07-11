"use client"

import * as React from "react"
import { useJDMatch } from "@/hooks/useJdMatch"
import { useResume } from "@/hooks/useResumes"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Target, Loader2, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function MatchPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const unwrappedParams = React.use(params)
  const resumeId = unwrappedParams.resumeId
  const { data: resume, isLoading: isLoadingResume } = useResume(resumeId)
  const match = useJDMatch()
  const [jdText, setJdText] = useState("")

  const handleMatch = () => {
    if (jdText.trim()) {
      match.mutate({ resumeId, jdText })
    }
  }


  if (isLoadingResume) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Job Description Match</h1>
        <p className="text-muted-foreground text-sm">
          Paste a job description to see how well <span className="font-semibold text-foreground">{resume?.title}</span> aligns.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col gap-4">
          <Textarea 
            placeholder="Paste the full job description here..." 
            className="min-h-[150px] resize-y font-sans text-sm"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleMatch} disabled={!jdText.trim() || match.isPending}>
              {match.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
              Analyze Match
            </Button>
          </div>
        </CardContent>
      </Card>

      {match.isSuccess && match.data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Match Score */}
            <Card className="md:col-span-1 border-pine/20 bg-pine/5 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="font-semibold text-pine mb-2">Match Score</h3>
              <div className="font-system text-6xl font-bold text-pine tracking-tighter">
                {match.data.matchPercentage}%
              </div>
              <p className="text-sm text-pine mt-4 max-w-[200px]">
                {match.data.matchPercentage > 80 ? 'Excellent alignment.' : match.data.matchPercentage > 60 ? 'Good alignment, but missing some key requirements.' : 'Significant gaps detected.'}
              </p>
            </Card>

            {/* Skills */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Skills Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-pine" />
                    Matching Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.data.matchingSkills.map(skill => (
                      <Badge key={skill} variant="default" className="bg-pine hover:bg-pine/90 font-system">
                        {skill}
                      </Badge>
                    ))}
                    {match.data.matchingSkills.length === 0 && (
                      <span className="text-sm text-muted-foreground">None detected.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-brick" />
                    Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.data.missingSkills.map(skill => (
                      <Badge key={skill} variant="destructive" className="bg-brick hover:bg-brick/90 font-system">
                        <Plus className="mr-1 h-3 w-3" />
                        {skill}
                      </Badge>
                    ))}
                    {match.data.missingSkills.length === 0 && (
                      <span className="text-sm text-muted-foreground">No missing skills detected.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Missing Keywords</CardTitle>
                <CardDescription>Exact terminology found in the JD but not your resume.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2">
                  {match.data.missingKeywords.map(kw => (
                    <li key={kw} className="font-system text-sm text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                      {kw}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experience Gaps</CardTitle>
                <CardDescription>Structural differences between your history and the JD.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {match.data.experienceGaps.map((gap, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-brick mt-1.5 shrink-0" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-ochre/20">
            <CardHeader>
              <CardTitle className="text-lg text-ochre flex items-center gap-2">
                <Target className="h-5 w-5" />
                Suggested Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {match.data.suggestedImprovements.map((imp, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm bg-ochre/5 p-3 rounded-md border border-ochre/10">
                    <span className="font-system text-ochre font-bold">{i+1}.</span>
                    <span className="text-foreground">{imp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
