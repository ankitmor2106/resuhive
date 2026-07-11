"use client"

import { useResetPassword } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const resetPass = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!token) return
    resetPass.mutate({ password: data.password, token })
  }

  // No token in URL — show error
  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="h-12 w-12 rounded-full bg-brick/10 text-brick flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-medium">Invalid Reset Link</h2>
        <p className="text-sm text-muted-foreground">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Button asChild className="w-full mt-4 bg-pine text-white hover:bg-pine/90">
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </div>
    )
  }

  if (resetPass.isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="h-12 w-12 rounded-full bg-pine/10 text-pine flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-medium">Password Reset</h2>
        <p className="text-sm text-muted-foreground">
          Your password has been successfully reset.
        </p>
        <Button asChild className="w-full mt-4 bg-pine text-white hover:bg-pine/90">
          <Link href="/login">Sign in with new password</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium">Create new password</h2>
        <p className="text-sm text-muted-foreground mt-1">Please enter your new password below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter new password" 
                      {...field} 
                    />
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Repeat new password" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {resetPass.isError && (
            <div className="p-3 rounded-md bg-brick/10 border border-brick/20 text-sm text-brick">
              {resetPass.error.message}
            </div>
          )}

          <Button type="submit" className="w-full bg-pine text-white hover:bg-pine/90" disabled={resetPass.isPending}>
            {resetPass.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  )
}
