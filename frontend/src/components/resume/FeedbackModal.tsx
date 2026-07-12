import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2 } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useAuth'
import { submitUserFeedback } from '@/services/feedback'
import { cleanupAiSuggestions } from '@/services/resumes'
import { useRouter } from 'next/navigation'

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

export function FeedbackModal({ open, onOpenChange, resumeId }: FeedbackModalProps) {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    // 1. Cleanup AI suggestions
    try {
      await cleanupAiSuggestions(resumeId);
    } catch (e) {
      console.error('Failed to cleanup AI suggestions', e);
    }
    
    // 2. Close modal and redirect to dashboard
    onOpenChange(false);
    router.push('/dashboard');
  };

  const handleSubmit = async () => {
    if (rating === 0) return; // Optional: enforce rating
    
    setIsSubmitting(true);
    try {
      await submitUserFeedback({
        rating,
        feedback,
      });
      await handleComplete();
    } catch (e) {
      console.error('Feedback submission failed', e);
      setIsSubmitting(false);
      // Even if feedback fails, we might want to still let them proceed or show error
      alert("Failed to submit feedback. Please try again or skip.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      // Prevent closing by clicking outside during submission
      if (isSubmitting) return;
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Resume Exported!</DialogTitle>
          <DialogDescription className="text-center text-md pt-2">
            Your feedback means a lot, we will definitely work on it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Tell us what you loved or how we can improve..."
            className="min-h-[120px] resize-none"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-4 mt-2">
          <Button 
            variant="ghost" 
            onClick={handleComplete}
            disabled={isSubmitting}
            className="text-slate-500"
          >
            Skip
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="bg-pine text-white hover:bg-pine/90 flex-1"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
