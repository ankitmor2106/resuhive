"use client"

import { useLogin } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getGoogleAuthUrl } from "@/services/auth"

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const [googleError, setGoogleError] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      setGoogleError(decodeURIComponent(error))
    }
  }, [searchParams])

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginForm) => {
    login.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-ink">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
      </div>

      {/* Google Sign-in */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 border-border font-medium gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => {
          window.location.href = getGoogleAuthUrl()
        }}
      >
        <GoogleIcon />
        Sign in with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
        </div>
      </div>

      {/* Error from Google OAuth redirect */}
      {googleError && (
        <div className="p-3 rounded-md bg-brick/10 border border-brick/20 text-sm text-brick animate-in fade-in duration-200">
          {googleError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring pr-10"
                      autoComplete="new-password"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                
                <div className="flex items-start pt-1">
                  <Link href="/forgot-password" className="text-sm font-medium text-pine hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {login.isError && (
            <div className="p-3 rounded-md bg-brick/10 border border-brick/20 text-sm text-brick animate-in fade-in duration-200">
              {login.error.message}
            </div>
          )}

          <Button type="submit" className="w-full h-10 bg-pine text-white hover:bg-pine/90 font-medium rounded-md cursor-pointer transition-colors" disabled={login.isPending}>
            {login.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Log in
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Don&apos;t have an account? </span>
        <Link href="/register" className="font-semibold text-pine hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
