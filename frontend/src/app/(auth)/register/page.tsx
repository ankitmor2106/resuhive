"use client"

import { useRegister } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useCallback, KeyboardEvent } from "react"
import { Eye, EyeOff, Loader2, X, ArrowLeft, ArrowRight, Briefcase, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getGoogleAuthUrl } from "@/services/auth"

// ── Step 1 Schema ──────────────────────────────────────────
const step1Schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dateOfBirth: z.string().optional(),
})

// ── Step 2 Schema (all optional / skippable) ───────────────
const step2Schema = z.object({
  occupation: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
})

type Step1Form = z.infer<typeof step1Schema>
type Step2Form = z.infer<typeof step2Schema>

const experienceOptions = [
  { label: "Fresher", value: "Fresher" },
  { label: "1–2 years", value: "1-2 years" },
  { label: "3–5 years", value: "3-5 years" },
  { label: "5–10 years", value: "5-10 years" },
  { label: "10+ years", value: "10+ years" },
]

// ── Google Icon SVG ────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ── Slide animations ───────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export default function RegisterPage() {
  const register = useRegister()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [skillInput, setSkillInput] = useState("")

  // Step 1 form
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      dateOfBirth: "",
    },
  })

  // Step 2 form
  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      occupation: "",
      experience: "",
      skills: [],
    },
  })

  const goToStep2 = () => {
    setDirection(1)
    setStep(2)
  }

  const goToStep1 = () => {
    setDirection(-1)
    setStep(1)
  }

  const handleStep1Submit = (data: Step1Form) => {
    goToStep2()
  }

  const handleStep2Submit = (data: Step2Form) => {
    const step1Data = step1Form.getValues()
    register.mutate({
      fullName: step1Data.fullName,
      email: step1Data.email,
      password: step1Data.password,
      dateOfBirth: step1Data.dateOfBirth || undefined,
      occupation: data.occupation || undefined,
      experience: data.experience || undefined,
      skills: data.skills?.length ? data.skills : undefined,
    })
  }

  const handleSkip = () => {
    const step1Data = step1Form.getValues()
    register.mutate({
      fullName: step1Data.fullName,
      email: step1Data.email,
      password: step1Data.password,
      dateOfBirth: step1Data.dateOfBirth || undefined,
    })
  }

  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim()
    if (!trimmed) return
    const current = step2Form.getValues("skills") || []
    if (!current.includes(trimmed)) {
      step2Form.setValue("skills", [...current, trimmed])
    }
    setSkillInput("")
  }, [skillInput, step2Form])

  const removeSkill = useCallback(
    (skill: string) => {
      const current = step2Form.getValues("skills") || []
      step2Form.setValue(
        "skills",
        current.filter((s) => s !== skill)
      )
    },
    [step2Form]
  )

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-ink">Create an account</h2>
        <p className="text-sm text-muted-foreground mt-2">Build your ATS-friendly resume today</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-pine" : "bg-muted"}`} />
        <div className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-pine" : "bg-muted"}`} />
      </div>

      {/* Google Sign-in */}
      {step === 1 && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 border-border font-medium gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => {
              window.location.href = getGoogleAuthUrl()
            }}
          >
            <GoogleIcon />
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>
        </>
      )}

      {/* Steps */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.25 }}
            >
              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4" autoComplete="off">
                  <FormField
                    control={step1Form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane Doe"
                            className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Date of Birth
                          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {register.isError && (
                    <div className="p-3 rounded-md bg-brick/10 border border-brick/20 text-sm text-brick animate-in fade-in duration-200">
                      {register.error.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-10 bg-pine text-white hover:bg-pine/90 font-medium rounded-md cursor-pointer transition-colors gap-2"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-pine/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-pine" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Professional Details</p>
                    <p className="text-xs text-muted-foreground">Used to pre-fill your resumes</p>
                  </div>
                </div>

                <Form {...step2Form}>
                  <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
                    <FormField
                      control={step2Form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Occupation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Software Engineer, Designer"
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Experience</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {experienceOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => field.onChange(field.value === opt.value ? "" : opt.value)}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 cursor-pointer ${
                                  field.value === opt.value
                                    ? "bg-pine text-white border-pine shadow-sm"
                                    : "border-border text-muted-foreground hover:border-pine/50 hover:text-foreground"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Skills
                            <span className="text-muted-foreground font-normal ml-1">(press Enter to add)</span>
                          </FormLabel>
                          <div className="space-y-2">
                            <div className="relative">
                              <Input
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="e.g. React, Python, Figma"
                                className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring pr-16"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="absolute right-1 top-1 h-8 text-xs text-pine hover:text-pine/80"
                                onClick={addSkill}
                                disabled={!skillInput.trim()}
                              >
                                Add
                              </Button>
                            </div>
                            {field.value && field.value.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {field.value.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pine/10 text-pine text-xs font-medium animate-in fade-in zoom-in-95 duration-200"
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    {skill}
                                    <button
                                      type="button"
                                      onClick={() => removeSkill(skill)}
                                      className="ml-0.5 hover:text-brick transition-colors cursor-pointer"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {register.isError && (
                      <div className="p-3 rounded-md bg-brick/10 border border-brick/20 text-sm text-brick animate-in fade-in duration-200">
                        {register.error.message}
                      </div>
                    )}

                    <div className="space-y-2 pt-1">
                      <Button
                        type="submit"
                        className="w-full h-10 bg-pine text-white hover:bg-pine/90 font-medium rounded-md cursor-pointer transition-colors"
                        disabled={register.isPending}
                      >
                        {register.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Complete Setup
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                          onClick={goToStep1}
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={handleSkip}
                          disabled={register.isPending}
                        >
                          {register.isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                          Skip for now
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="text-center text-sm pt-1">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="font-semibold text-pine hover:underline">
          Log in
        </Link>
      </div>
    </div>
  )
}
