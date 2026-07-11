import * as React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { LivePreview } from "@/components/resume/LivePreview"

export function PrintDialog({ resume, trigger }: { resume: any, trigger: React.ReactNode }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {/* 
        We use an inline style or Tailwind classes to make the modal look like a sandbox.
        bg-black/80 for the backdrop is handled by Radix DialogOverlay internally.
        We make DialogContent transparent so it doesn't have the default white card look,
        then we put the resume inside a white wrapper.
      */}
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] overflow-y-auto bg-slate-100 p-6 sm:p-10 !print:p-0 !print:bg-white !print:h-auto !print:w-full !print:overflow-visible !print:max-w-none border-none">
        
        {/* Print Controls (hidden during actual print) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Print Resume</h2>
            <p className="text-sm text-slate-500">Review your resume before exporting to PDF</p>
          </div>
          <Button onClick={handlePrint} className="bg-pine text-white hover:bg-pine/90 mt-4 sm:mt-0 shadow-md">
            <Printer className="mr-2 h-4 w-4" /> Download / Save as PDF
          </Button>
        </div>

        {/* The actual resume sandbox container */}
        <div className="print-area flex justify-center bg-white shadow-2xl print:shadow-none mx-auto w-fit rounded-sm overflow-hidden border border-slate-200 print:border-none">
          <LivePreview resume={resume} />
        </div>

      </DialogContent>
    </Dialog>
  )
}
