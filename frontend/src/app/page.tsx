import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutTemplate, Sparkles, CheckSquare, Eye, Globe, LineChart, Star, CheckCircle2 } from "lucide-react"
import { Logo } from "@/components/layout/Logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-pine/20">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform group-hover:scale-105">
            <Logo showText iconClassName="h-8" />
          </Link>
          
          {/* Right Links */}
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-ink hidden sm:block">
              Contact Us
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-semibold hover:bg-pine/10 hover:text-pine">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Blobs (Abstract Glow) */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-blue-100/50 blur-3xl opacity-60 mix-blend-multiply" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-yellow-100/40 blur-3xl opacity-60 mix-blend-multiply" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-50/50 blur-3xl opacity-60 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Hero Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink mb-6 font-serif leading-[1.1]">
              The Ultimate <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pine to-blue-600">AI Resume Builder</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Get the job 2x as fast. Use recruiter-approved templates and step-by-step AI content recommendations to create a new resume or optimize your current one.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-pine hover:bg-pine/90 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-pine/20 transition-transform hover:-translate-y-1">
                  Create new resume
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-semibold border-2 border-border hover:bg-muted/50 transition-transform hover:-translate-y-1">
                  Optimize my resume
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 bg-white/60 backdrop-blur-sm border border-border/50 py-3 px-5 rounded-2xl w-max mx-auto lg:mx-0 shadow-sm">
              <div className="flex gap-1 text-green-600">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <div className="text-sm font-medium text-ink">
                4.9 out of 5 based on 10,000+ reviews
              </div>
            </div>
          </div>
          
          {/* Hero Right Visual (Mockup) */}
          <div className="flex-1 w-full max-w-[500px] lg:max-w-none mx-auto relative perspective-1000">
            {/* Abstract Decorative Lines */}
            <svg className="absolute -top-10 -left-10 w-32 h-32 text-green-400 opacity-50 z-0 hidden sm:block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20 Q 30 5 50 20 T 90 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M10 40 Q 30 25 50 40 T 90 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M10 60 Q 30 45 50 60 T 90 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            
            {/* The Resume Mockup Document */}
            <div className="relative z-10 bg-white rounded-xl shadow-2xl border border-border p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-[420px] mx-auto aspect-[1/1.4] flex flex-col">
              {/* Fake Resume Header */}
              <div className="flex gap-4 mb-6 items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 shrink-0 border-2 border-blue-200 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-blue-200/50 flex items-center justify-center text-blue-500 font-bold text-xl">JD</div>
                </div>
                <div>
                  <div className="w-40 h-5 bg-slate-200 rounded-md mb-2" />
                  <div className="w-24 h-3 bg-slate-100 rounded-md mb-1" />
                  <div className="w-32 h-3 bg-slate-100 rounded-md" />
                </div>
              </div>
              
              {/* Fake Resume Sections */}
              <div className="space-y-5 flex-1">
                <div>
                  <div className="w-20 h-4 bg-slate-200 rounded-md mb-3" />
                  <div className="w-full h-2 bg-slate-100 rounded-full mb-2" />
                  <div className="w-[90%] h-2 bg-slate-100 rounded-full mb-2" />
                  <div className="w-[80%] h-2 bg-slate-100 rounded-full" />
                </div>
                <div>
                  <div className="w-20 h-4 bg-slate-200 rounded-md mb-3" />
                  <div className="flex gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-pine shrink-0 mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-2 bg-slate-100 rounded-full" />
                      <div className="w-[85%] h-2 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-pine shrink-0 mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-2 bg-slate-100 rounded-full" />
                      <div className="w-[70%] h-2 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Tooltip Overlay */}
              <div className="absolute top-1/3 -right-6 sm:-right-12 bg-white rounded-xl shadow-xl shadow-pine/10 border border-pine/20 p-3 sm:p-4 w-48 sm:w-56 transform -rotate-2 animate-bounce-slow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-amber-100 text-amber-600 p-1 rounded-md">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm text-ink font-serif">Enhance with AI</span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                  Make your bullets impactful. Analyzed requirement to develop software solutions...
                </p>
                <div className="flex items-center gap-1 mt-1 text-pine text-[10px] font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Applied 3 suggestions
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. Features Grid Section */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-16 text-ink font-serif tracking-tight">
            6 features to boost your job search
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-indigo-50/50 rounded-2xl p-8 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <LayoutTemplate className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="font-bold text-xl text-ink mb-2">Professional Templates</h3>
              <p className="text-muted-foreground text-sm">Stand out with beautifully designed, recruiter-approved templates for every industry.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-blue-50/50 rounded-2xl p-8 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl text-ink mb-2">Enhance with AI</h3>
              <p className="text-muted-foreground text-sm">Write flawless bullet points and summaries instantly with advanced AI suggestions.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-purple-50/50 rounded-2xl p-8 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-purple-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <CheckSquare className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="font-bold text-xl text-ink mb-2">Resume Review</h3>
              <p className="text-muted-foreground text-sm">Score your resume against real job descriptions to ensure you pass ATS scans.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-rose-50/50 rounded-2xl p-8 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Eye className="h-10 w-10 text-rose-500" />
              </div>
              <h3 className="font-bold text-xl text-ink mb-2">Real-time Preview</h3>
              <p className="text-muted-foreground text-sm">See exactly how your resume will look instantly as you edit it in our smart builder.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-amber-50/50 rounded-2xl p-8 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-amber-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Globe className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="font-bold text-xl text-ink mb-2">Resume Website</h3>
              <p className="text-muted-foreground text-sm">Publish your resume online instantly and share a clean, professional web link.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-emerald-50/50 rounded-2xl p-8 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <LineChart className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="font-bold text-xl text-ink mb-2">Resume Tracking</h3>
              <p className="text-muted-foreground text-sm">Track job applications and monitor which employers are viewing your resume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Subtle Background Glow for bottom CTA */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[80%] rounded-full bg-blue-100 blur-3xl mix-blend-multiply" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink font-serif tracking-tight max-w-3xl leading-[1.1]">
              Create a resume <br className="hidden sm:block" />
              <span className="relative inline-block">
                that gets results
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-pine" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>
            
            <div className="mt-8 flex items-center justify-center gap-4 group">
              <svg className="w-16 h-16 text-muted-foreground hidden sm:block transform rotate-12 group-hover:translate-x-2 transition-transform" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20,50 Q40,30 80,50 M60,35 L80,50 L65,70" />
              </svg>
              <Link href="/dashboard">
                <Button size="lg" className="bg-pine hover:bg-pine/90 text-white rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-pine/20 transition-all hover:-translate-y-1">
                  Choose a template
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
