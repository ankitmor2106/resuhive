"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { CheckCircle2, Loader2, Mail, MessageSquare, Phone, ArrowLeft } from "lucide-react"
import { submitContactForm } from "@/services/contact"

const TOPICS = [
  "Feedback",
  "Page Errors",
  "Other"
]

export default function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState("Feedback")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      topic: selectedTopic,
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      message: formData.get("message") as string,
    }
    
    try {
      await submitContactForm(data)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Branding & Info */}
        <div className="w-full lg:w-5/12 bg-pine text-white p-8 md:p-16 lg:p-24 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-pine-100 hover:text-white transition-colors mb-12">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Let's talk about <br />
              <span className="text-blue-200">your career.</span>
            </h1>
            <p className="text-pine-50 text-lg mb-12 max-w-md leading-relaxed opacity-90">
              Have comments, questions, or feedback to share? Our team would love to hear from you. 
              We typically respond within 24 hours.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-pine-50 hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm opacity-70">Email us at</div>
                  <div className="font-semibold text-lg">support@resuhive.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-pine-50 hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm opacity-70">Live Chat</div>
                  <div className="font-semibold text-lg">Available 9am - 5pm EST</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-20 lg:mt-0 pt-8 border-t border-white/20">
            <p className="text-sm text-pine-100 opacity-80">
              Trusted by thousands of professionals worldwide to land their dream jobs.
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full lg:w-7/12 p-8 md:p-16 lg:p-24 bg-slate-50 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border-8 border-green-50/50">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-ink mb-3">Message Sent!</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Thank you for reaching out. Our support team will review your message and get back to you shortly.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="h-12 px-8 rounded-full border-2">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
                
                {/* Topic Selection */}
                <div>
                  <h3 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">How can we help?</h3>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                          selectedTopic === topic
                            ? "bg-pine border-pine text-white shadow-md shadow-pine/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-pine/50 hover:bg-slate-50"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm">
                    {error}
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-ink">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-pine h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-ink">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-pine h-12 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="message" className="text-sm font-bold text-ink">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="How can we help you today?"
                      className="bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-pine min-h-[160px] resize-y rounded-xl p-4"
                    />
                  </div>
                </div>

                {/* Footer / Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-6">
                  <p className="text-xs text-muted-foreground text-center sm:text-left leading-relaxed">
                    By submitting this form, you agree to our{" "}
                    <a href="#" className="text-pine font-medium hover:underline">Privacy Policy</a> and{" "}
                    <a href="#" className="text-pine font-medium hover:underline">Terms of Service</a>.
                  </p>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-pine hover:bg-pine/90 text-white px-10 h-12 rounded-full font-bold shadow-lg shadow-pine/20 shrink-0 transition-transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
