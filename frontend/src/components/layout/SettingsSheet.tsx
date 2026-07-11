"use client"

import { useAuthStore } from "@/stores/authStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLogout, useUpdateProfile, useUpdatePassword } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { Eye, EyeOff, LogOut, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export function SettingsSheet({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore()
  const logout = useLogout()
  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()

  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false)

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      occupation: "",
      experience: "",
      skills: "",
    },
  })

  // Sync profile form defaults when currentUser loads
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        fullName: currentUser.fullName,
        email: currentUser.email,
        dateOfBirth: currentUser.dateOfBirth ? currentUser.dateOfBirth.split('T')[0] : "",
        occupation: currentUser.occupation || "",
        experience: currentUser.experience || "",
        skills: currentUser.skills ? currentUser.skills.join(", ") : "",
      })
    }
  }, [currentUser, profileForm, open])

  // Password Form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onProfileSubmit = (data: ProfileFormValues) => {
    const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    updateProfile.mutate({ 
      ...data, 
      dateOfBirth: data.dateOfBirth || undefined,
      occupation: data.occupation || undefined,
      experience: data.experience || undefined,
      skills: skillsArray 
    }, {
      onSuccess: () => {
        toast.success("Profile updated successfully")
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update profile")
      }
    })
  }

  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePassword.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }, {
      onSuccess: () => {
        toast.success("Password updated successfully")
        passwordForm.reset()
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update password")
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:max-w-[45vw] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-3xl font-bold tracking-tight text-ink">Settings</SheetTitle>
          <SheetDescription>Manage your account preferences and security.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-ink">Profile Information</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Update your account name and email address</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Date of Birth</FormLabel>
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

                    <FormField
                      control={profileForm.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Occupation</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Software Engineer"
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Skills (Comma-separated)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. React, Node.js, Typescript"
                            className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Experience Summary</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief summary of your experience"
                            className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="h-10 bg-pine text-white hover:bg-pine/90 font-medium rounded-md px-4 mt-2 cursor-pointer transition-colors"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-ink">
                {currentUser?.hasPassword ? "Change Password" : "Create Password"}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {currentUser?.hasPassword ? "Secure your account with a strong password" : "Create a password to sign in without your Google account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  {currentUser?.hasPassword && (
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Current Password</FormLabel>
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Confirm New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              className="h-10 border-border bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="h-10 border border-ochre text-ochre bg-ochre/5 hover:bg-ochre/10 hover:text-ochre font-medium rounded-md px-4 mt-2 cursor-pointer transition-colors"
                    disabled={updatePassword.isPending}
                  >
                    {updatePassword.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {currentUser?.hasPassword ? "Update Password" : "Set Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Destructive Sign Out Card */}
          <Card className="border border-brick/20 bg-brick/5 dark:bg-brick/10 dark:border-brick/30 text-brick shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Sign Out</CardTitle>
              <CardDescription className="text-sm text-brick/80">Log out of your account on this device.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setOpen(false)
                  logout.mutate()
                }} 
                disabled={logout.isPending}
                className="h-10 border-brick text-brick hover:bg-brick/10 font-medium rounded-md flex items-center gap-2"
              >
                {logout.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
