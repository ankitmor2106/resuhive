import React from 'react'
import { Resume, ResumeTheme } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Check } from 'lucide-react'

interface ThemeEditorProps {
  resume: Resume;
  updateResume: any; // Use mutation type from trpc/react-query ideally, but any is fine for this UI
}

const COLORS = [
  { id: 'slate', value: '#0f172a', class: 'bg-slate-900' },
  { id: 'red', value: '#dc2626', class: 'bg-red-600' },
  { id: 'blue', value: '#2563eb', class: 'bg-blue-600' },
  { id: 'emerald', value: '#059669', class: 'bg-emerald-600' },
  { id: 'violet', value: '#7c3aed', class: 'bg-violet-600' },
  { id: 'rose', value: '#e11d48', class: 'bg-rose-600' },
]

export function ThemeEditor({ resume, updateResume }: ThemeEditorProps) {
  const theme: ResumeTheme = resume.theme || {};

  const handleUpdate = (updates: Partial<ResumeTheme>) => {
    updateResume.mutate({
      id: resume.id,
      data: {
        theme: { ...theme, ...updates }
      }
    });
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Customize Theme</h2>
        <p className="text-muted-foreground text-sm">
          Select colors, fonts, and spacing to personalize your resume.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accent Color</CardTitle>
          <CardDescription>Choose the primary color for headers and borders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {COLORS.map((color) => {
              const isSelected = theme.primaryColor === color.value || (!theme.primaryColor && color.id === 'slate');
              return (
                <button
                  key={color.id}
                  onClick={() => handleUpdate({ primaryColor: color.value })}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${color.class} ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'}`}
                  aria-label={`Select ${color.id} color`}
                >
                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Typography</CardTitle>
          <CardDescription>Select the font family for your resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={theme.fontFamily || 'sans'} 
            onValueChange={(val) => handleUpdate({ fontFamily: val })}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div>
              <RadioGroupItem value="sans" id="font-sans" className="peer sr-only" />
              <Label htmlFor="font-sans" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-sans">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Sans-serif</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="serif" id="font-serif" className="peer sr-only" />
              <Label htmlFor="font-serif" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-serif">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Serif</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="mono" id="font-mono" className="peer sr-only" />
              <Label htmlFor="font-mono" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-mono">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Monospace</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="inter" id="font-inter" className="peer sr-only" />
              <Label htmlFor="font-inter" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-inter">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Inter</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="playfair" id="font-playfair" className="peer sr-only" />
              <Label htmlFor="font-playfair" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-playfair">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Playfair</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="roboto" id="font-roboto" className="peer sr-only" />
              <Label htmlFor="font-roboto" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-roboto">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Roboto</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="lora" id="font-lora" className="peer sr-only" />
              <Label htmlFor="font-lora" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-lora">
                <span className="text-xl font-bold mb-1">Aa</span>
                <span className="text-sm">Lora</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spacing</CardTitle>
          <CardDescription>Adjust the density and padding of the layout.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={theme.spacing || 'normal'} 
            onValueChange={(val: any) => handleUpdate({ spacing: val })}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="spacing-compact" />
              <Label htmlFor="spacing-compact">Compact (Fit more content)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="spacing-normal" />
              <Label htmlFor="spacing-normal">Normal (Standard margins)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relaxed" id="spacing-relaxed" />
              <Label htmlFor="spacing-relaxed">Relaxed (More breathing room)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

    </div>
  )
}
