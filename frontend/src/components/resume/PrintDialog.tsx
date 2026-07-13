import * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { LivePreview } from "@/components/resume/LivePreview"
import { FeedbackModal } from "./FeedbackModal"

export function PrintDialog({ resume, trigger }: { resume: any, trigger: React.ReactNode }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  useEffect(() => {
    const handleAfterPrint = () => {
      // The print dialog was closed (either printed or cancelled)
      setFeedbackOpen(true);
    };
    
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = () => {
    const printContent = document.querySelector('.print-area')?.innerHTML;
    if (!printContent) return;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '850px';
    iframe.style.height = '1100px';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(el => el.outerHTML)
        .join('\n');
        
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <base href="${window.location.origin}">
            ${styleTags}
            <style>
              @media print {
                body { margin: 0; padding: 0; background: white; }
                .print-area { position: static !important; width: 100% !important; height: auto !important; box-shadow: none !important; border: none !important; padding: 20px !important; }
                .resume-paper { aspect-ratio: auto !important; min-height: auto !important; height: auto !important; max-width: 100% !important; }
              }
            </style>
          </head>
          <body>
            <div class="print-area">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          setFeedbackOpen(true);
        }, 1000);
      }, 500);
    }
  }

  return (
    <>
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
          <div className="print-area flex justify-center bg-white shadow-2xl print:shadow-none mx-auto w-[850px] max-w-full rounded-sm overflow-hidden border border-slate-200 print:border-none">
            <LivePreview resume={resume} />
          </div>

        </DialogContent>
      </Dialog>
      
      <FeedbackModal 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen} 
        resumeId={resume.id} 
      />
    </>
  )
}
