"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Twitter, Linkedin, Github } from "lucide-react"

export function GlobalFooter() {
  const pathname = usePathname()

  // Hide the footer on the resume builder page as it requires a full-screen app layout
  if (pathname?.includes('/builder')) {
    return null
  }

  return (
    <footer className="bg-white border-t border-border/40 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-pine rounded-md p-1 transition-transform group-hover:scale-105">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-ink">Resumate<span className="text-pine">.</span></span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Build ATS-friendly resumes and get hired faster with AI-powered insights.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-pine transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pine transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pine transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Services</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-pine transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/dashboard" className="hover:text-pine transition-colors">ATS Analysis</Link></li>
              <li><Link href="/dashboard" className="hover:text-pine transition-colors">Job Description Match</Link></li>
              <li><Link href="/dashboard" className="hover:text-pine transition-colors">Professional Templates</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Account</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-pine transition-colors">Log In</Link></li>
              <li><Link href="/register" className="hover:text-pine transition-colors">Sign Up</Link></li>
              <li><Link href="/dashboard" className="hover:text-pine transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-pine transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Resumate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
