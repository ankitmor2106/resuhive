"use client"

import { useForgotPassword } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
})

export default function ForgotPasswordPage() {
  const reset = useForgotPassword()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    reset.mutate(data.email)
  }

  if (reset.isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="h-12 w-12 rounded-full bg-pine/10 text-pine flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-medium">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          We've sent a password reset link to <span className="font-medium text-foreground">{form.getValues().email}</span>.
        </p>
        <Button asChild className="w-full mt-4" variant="outline">
          <Link href="/login">Return to sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium">Reset password</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {reset.isError && (
            <div className="p-3 rounded-md bg-brick/10 border border-brick/20 text-sm text-brick">
              {reset.error.message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={reset.isPending}>
            {reset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send Reset Link
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
