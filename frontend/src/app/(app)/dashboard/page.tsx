"use client"

import { useResumes, useDeleteResume, useDuplicateResume, useCreateResume } from "@/hooks/useResumes"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Copy, Trash2, FileText, ExternalLink, MoreVertical, Calendar, Upload } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { data: resumes, isLoading } = useResumes()
  const createResume = useCreateResume()
  const deleteResume = useDeleteResume()
  const duplicateResume = useDuplicateResume()
  const router = useRouter()

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = () => {
    createResume.mutate({ title: "New Resume" }, {
      onSuccess: (res) => router.push(`/resume/${res.id}/builder`)
    })
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteResume.mutate(deleteId, {
        onSuccess: () => setDeleteId(null)
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!resumes?.length) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-6">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Create your first resume</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Start from scratch or import an existing resume to begin tailoring your application to the perfect job.
        </p>
        <div className="flex gap-4">
          <Button onClick={handleCreate} disabled={createResume.isPending}>
            {createResume.isPending ? "Creating..." : "Start from scratch"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/resume-import">Import Resume</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-1 text-ink">Your Resumes</h1>
          <p className="text-muted-foreground text-sm">Manage and optimize your professional profiles.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="h-10 border-border bg-transparent text-foreground hover:bg-muted font-medium">
            <Link href="/resume-import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Resume
            </Link>
          </Button>
          <Button onClick={handleCreate} disabled={createResume.isPending} className="h-10 bg-pine text-white hover:bg-pine/90 font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="flex flex-col group border border-border bg-card shadow-sm hover:border-pine/30 transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      resume.status === 'ACTIVE' 
                        ? 'bg-pine text-white dark:bg-pine dark:text-white' 
                        : resume.status === 'ARCHIVED'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-white'
                    }`}
                  >
                    {resume.status}
                  </Badge>
                  <Badge className="text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border-transparent">
                    {resume.templateId}-1
                  </Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/resume/${resume.id}/builder`)}>
                      <ExternalLink className="mr-2 h-4 w-4" /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateResume.mutate(resume.id)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={() => setDeleteId(resume.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl font-semibold mt-2 text-ink line-clamp-1">{resume.title}</CardTitle>
              <div className="text-xs text-muted-foreground font-system mt-1">
                Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 pb-6 pt-2">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {resume.professionalSummary || "No professional summary defined for this resume."}
              </p>
            </CardContent>
            
            <CardFooter className="grid grid-cols-2 gap-3 pt-0 pb-4">
              <Button variant="outline" className="w-full h-9 border-border bg-transparent text-foreground hover:bg-muted" asChild>
                <Link href={`/resume/${resume.id}/builder`}>Edit</Link>
              </Button>
              <Button variant="outline" className="w-full h-9 border-ochre text-ochre bg-ochre/5 hover:bg-ochre/10 hover:text-ochre" asChild>
                <Link href={`/resume/${resume.id}/analysis`}>Score</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteResume.isPending}>
              {deleteResume.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
