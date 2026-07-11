"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Resume, ExperienceEntry, EducationEntry, SkillGroup, ProjectEntry } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SectionEditorWrapper } from "./SectionEditorWrapper"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useBuilderStore } from "@/stores/builderStore"

interface ResumeFormsProps {
  resume: Resume
  resumeId: string
  save: (data: Partial<Resume>) => void
}

export function ResumeForms({ resume, resumeId, save }: ResumeFormsProps) {
  const { setActiveSectionId, setAiPanelOpen, setAiContextType, setAiContextData } = useBuilderStore()
  
  const [activeSection, setActiveSection] = useState<string>("personalInfo")

  const handleSaveAndNext = (currentSectionId: string) => {
    const allSections = ["personalInfo", ...resume.sectionOrder.filter(id => id !== 'personalInfo')]
    const currentIndex = allSections.indexOf(currentSectionId)
    if (currentIndex !== -1 && currentIndex < allSections.length - 1) {
      setActiveSection(allSections[currentIndex + 1])
    } else {
      setActiveSection("")
    }
  }

  const handleToggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? "" : sectionId)
  }
  
  const personalForm = useForm({
    defaultValues: {
      fullName: resume.personalInfo?.fullName || "",
      email: resume.personalInfo?.email || "",
      phone: resume.personalInfo?.phone || "",
      dateOfBirth: resume.personalInfo?.dateOfBirth || "",
      location: resume.personalInfo?.location || "",
      linkedin: resume.personalInfo?.linkedin || "",
      github: resume.personalInfo?.github || "",
      photoUrl: resume.personalInfo?.photoUrl || "",
    }
  })

  useEffect(() => {
    const subscription = personalForm.watch((value) => {
      save({ personalInfo: value as any })
    })
    return () => subscription.unsubscribe()
  }, [personalForm.watch, save])

  // Summary Form
  const summaryForm = useForm({
    defaultValues: { summary: resume.professionalSummary || "" }
  })

  useEffect(() => {
    const subscription = summaryForm.watch((value) => {
      save({ professionalSummary: value.summary })
    })
    return () => subscription.unsubscribe()
  }, [summaryForm.watch, save])

  // Experience Form
  const expForm = useForm({
    defaultValues: { experience: resume.experience }
  })
  
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: expForm.control,
    name: "experience"
  })

  useEffect(() => {
    const subscription = expForm.watch((value) => {
      save({ experience: value.experience as any })
    })
    return () => subscription.unsubscribe()
  }, [expForm.watch, save])

  // Education Form
  const eduForm = useForm({
    defaultValues: { education: resume.education }
  })
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: eduForm.control,
    name: "education"
  })
  useEffect(() => {
    const subscription = eduForm.watch((value) => {
      save({ education: value.education as any })
    })
    return () => subscription.unsubscribe()
  }, [eduForm.watch, save])

  // Projects Form
  const projForm = useForm({
    defaultValues: { 
      projects: (resume.projects || []).map(p => ({
        ...p,
        technologiesString: p.technologies ? p.technologies.join(", ") : ""
      }))
    }
  })
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control: projForm.control,
    name: "projects"
  })
  useEffect(() => {
    const subscription = projForm.watch((value) => {
      const projects = (value.projects || []).map((p: any) => {
        const { technologiesString, ...rest } = p
        return {
          ...rest,
          technologies: (technologiesString || '').split(',').map((s: string) => s.trim()).filter(Boolean)
        }
      })
      save({ projects })
    })
    return () => subscription.unsubscribe()
  }, [projForm.watch, save])

  // Skills Form
  const skillForm = useForm({
    defaultValues: { 
      skills: (resume.skills || []).map(s => ({
        ...s,
        itemsString: s.items ? s.items.join(", ") : ""
      }))
    }
  })
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: skillForm.control,
    name: "skills"
  })
  useEffect(() => {
    const subscription = skillForm.watch((value) => {
      const skills = (value.skills || []).map((s: any) => {
        const { itemsString, ...rest } = s
        return {
          ...rest,
          items: (itemsString || '').split(',').map((item: string) => item.trim()).filter(Boolean)
        }
      })
      save({ skills })
    })
    return () => subscription.unsubscribe()
  }, [skillForm.watch, save])

  // Custom Form
  const customForm = useForm({
    defaultValues: { custom: resume.custom || { title: '', content: '' } }
  })
  useEffect(() => {
    const subscription = customForm.watch((value) => {
      save({ custom: value.custom as any })
    })
    return () => subscription.unsubscribe()
  }, [customForm.watch, save])

  // Handle AI suggestion acceptance
  useEffect(() => {
    const handleSuggestionAccepted = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { sectionId, suggestedText, type } = customEvent.detail;
      
      if (sectionId === 'summary') {
        summaryForm.setValue('summary', suggestedText, { shouldDirty: true });
        save({ professionalSummary: suggestedText });
      } else if (sectionId.startsWith('exp_')) {
        const index = parseInt(sectionId.split('_')[1], 10);
        if (type === 'ACHIEVEMENT') {
          const currentBullets = expForm.getValues(`experience.${index}.bullets`) || [];
          const newBullets = [...currentBullets.filter(b => b.trim() !== ''), suggestedText];
          expForm.setValue(`experience.${index}.bullets`, newBullets, { shouldDirty: true });
        } else {
            // For rewriting a single bullet or entire section, could handle here
            // Currently, we only request ACHIEVEMENT for experiences
        }
        save({ experience: expForm.getValues('experience') as any });
      }
    };

    window.addEventListener('ai-suggestion-accepted', handleSuggestionAccepted);
    return () => window.removeEventListener('ai-suggestion-accepted', handleSuggestionAccepted);
  }, [summaryForm, expForm, save]);

  // Simple bullet handler (since nested useFieldArray for strings is tricky)
  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    expForm.setValue(`experience.${expIndex}.bullets.${bulletIndex}`, value, { shouldDirty: true });
  }

  const addBullet = (expIndex: number) => {
    const bullets = expForm.getValues(`experience.${expIndex}.bullets`) || [];
    expForm.setValue(`experience.${expIndex}.bullets`, [...bullets, ""]);
  }

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const bullets = expForm.getValues(`experience.${expIndex}.bullets`) || [];
    const newBullets = [...bullets];
    newBullets.splice(bulletIndex, 1);
    expForm.setValue(`experience.${expIndex}.bullets`, newBullets);
  }

  const openAiPanel = (sectionId: string, contextType: 'SUMMARY' | 'ACHIEVEMENT' | 'REWRITE', contextData: any) => {
    setActiveSectionId(sectionId)
    setAiContextType(contextType)
    setAiContextData(contextData)
    setAiPanelOpen(true)
  }

  return (
    <div className="space-y-1">
      {/* 1. Personal Info - Always Locked & Top */}
      <SectionEditorWrapper 
        id="personalInfo" 
        title="Personal Information" 
        isLocked={true}
        isExpanded={activeSection === "personalInfo"}
        onToggle={() => handleToggleSection("personalInfo")}
      >
        <Form {...personalForm}>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={personalForm.control} name="fullName" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="dateOfBirth" render={({ field }) => (
              <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="location" render={({ field }) => (
              <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="linkedin" render={({ field }) => (
              <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="github" render={({ field }) => (
              <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={personalForm.control} name="photoUrl" render={({ field: { value, onChange } }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Profile Photo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    {value && (
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
                        <img src={value} alt="Profile preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {value && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-destructive hover:text-destructive h-auto py-1 px-2"
                          onClick={() => onChange("")}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )} />
            <div className="sm:col-span-2 flex justify-end pt-4 border-t border-border mt-2">
              <Button type="button" onClick={() => handleSaveAndNext("personalInfo")} className="bg-pine text-white hover:bg-pine/90 font-medium">
                Save & Next
              </Button>
            </div>
          </form>
        </Form>
      </SectionEditorWrapper>

      {/* RENDER DYNAMIC ORDER EXCEPT PERSONAL INFO */}
      {resume.sectionOrder.filter(id => id !== 'personalInfo').map(sectionId => {
        if (sectionId === 'professionalSummary') {
          return (
            <SectionEditorWrapper 
              key={sectionId} 
              id={sectionId} 
              title="Professional Summary"
              isExpanded={activeSection === sectionId}
              onToggle={() => handleToggleSection(sectionId)}
            >
              <Form {...summaryForm}>
                <form>
                  <FormField control={summaryForm.control} name="summary" render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel>Summary</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={() => {
                          const currentSummary = summaryForm.getValues('summary')
                          openAiPanel('summary', 'REWRITE', { sectionData: currentSummary, instructions: 'Improve this summary' })
                        }} className="h-7 text-xs text-ochre border-ochre/20 hover:bg-ochre/10">
                          <Sparkles className="h-3 w-3 mr-1" /> Improve with AI
                        </Button>
                      </div>
                      <FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <div className="flex justify-end pt-4 border-t border-border mt-4">
                    <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                      Save & Next
                    </Button>
                  </div>
                </form>
              </Form>
            </SectionEditorWrapper>
          )
        }

        if (sectionId === 'experience') {
          return (
            <SectionEditorWrapper 
              key={sectionId} 
              id={sectionId} 
              title="Experience"
              isExpanded={activeSection === sectionId}
              onToggle={() => handleToggleSection(sectionId)}
            >
              <Form {...expForm}>
                <form className="space-y-8">
                  {expFields.map((field, index) => (
                    <div key={field.id} className="relative p-4 border border-border rounded-lg bg-background group">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExp(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-2">
                        <FormField control={expForm.control} name={`experience.${index}.role`} render={({ field }) => (
                          <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={expForm.control} name={`experience.${index}.company`} render={({ field }) => (
                          <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <FormField control={expForm.control} name={`experience.${index}.startDate`} render={({ field }) => (
                            <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="MM/YYYY" {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={expForm.control} name={`experience.${index}.endDate`} render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl><Input placeholder="MM/YYYY" {...field} disabled={expForm.watch(`experience.${index}.current`)} /></FormControl>
                            </FormItem>
                          )} />
                        </div>
                        
                        <FormField control={expForm.control} name={`experience.${index}.location`} render={({ field }) => (
                          <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        
                        <FormField control={expForm.control} name={`experience.${index}.current`} render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 pt-8">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I currently work here</FormLabel>
                            </div>
                          </FormItem>
                        )} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <FormLabel>Bullets</FormLabel>
                          <Button type="button" variant="outline" size="sm" onClick={() => {
                            const expData = expForm.getValues(`experience.${index}`)
                            openAiPanel(`exp_${index}`, 'ACHIEVEMENT', { role: expData?.role || 'Professional', company: expData?.company || 'Company' })
                          }} className="h-7 text-xs text-ochre border-ochre/20 hover:bg-ochre/10">
                            <Sparkles className="h-3 w-3 mr-1" /> Suggest Bullets
                          </Button>
                        </div>
                        {expForm.watch(`experience.${index}.bullets`).map((bullet, bIndex) => (
                          <div key={bIndex} className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-ink mt-2.5 shrink-0" />
                            <Textarea 
                              {...expForm.register(`experience.${index}.bullets.${bIndex}` as const)}
                              className="min-h-[60px] text-sm"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeBullet(index, bIndex)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="ghost" size="sm" onClick={() => addBullet(index)} className="mt-2 text-xs">
                          <Plus className="h-3 w-3 mr-1" /> Add Bullet
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendExp({ id: `exp_${Date.now()}`, company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] })} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                  <div className="flex justify-end pt-4 border-t border-border mt-4">
                    <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                      Save & Next
                    </Button>
                  </div>
                </form>
              </Form>
            </SectionEditorWrapper>
          )
        }
        
        if (sectionId === 'education') {
          return (
            <SectionEditorWrapper 
              key={sectionId} 
              id={sectionId} 
              title="Education"
              isExpanded={activeSection === sectionId}
              onToggle={() => handleToggleSection(sectionId)}
            >
              <Form {...eduForm}>
                <form className="space-y-6">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="relative p-4 border border-border rounded-lg bg-background group">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeEdu(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <FormField control={eduForm.control} name={`education.${index}.institution`} render={({ field }) => (
                          <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={eduForm.control} name={`education.${index}.degree`} render={({ field }) => (
                          <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={eduForm.control} name={`education.${index}.field`} render={({ field }) => (
                          <FormItem><FormLabel>Field of Study</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-2">
                          <FormField control={eduForm.control} name={`education.${index}.startYear`} render={({ field }) => (
                            <FormItem><FormLabel>Start Year</FormLabel><FormControl><Input placeholder="2012" {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={eduForm.control} name={`education.${index}.endYear`} render={({ field }) => (
                            <FormItem><FormLabel>End Year</FormLabel><FormControl><Input placeholder="2016" {...field} /></FormControl></FormItem>
                          )} />
                        </div>
                        <FormField control={eduForm.control} name={`education.${index}.grade`} render={({ field }) => (
                          <FormItem className="sm:col-span-2"><FormLabel>Grade / GPA (Optional)</FormLabel><FormControl><Input placeholder="3.8 / 4.0" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendEdu({ id: `edu_${Date.now()}`, institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' })} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                  <div className="flex justify-end pt-4 border-t border-border mt-4">
                    <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                      Save & Next
                    </Button>
                  </div>
                </form>
              </Form>
            </SectionEditorWrapper>
          )
        }

        if (sectionId === 'projects') {
          return (
            <SectionEditorWrapper 
              key={sectionId} 
              id={sectionId} 
              title="Projects"
              isExpanded={activeSection === sectionId}
              onToggle={() => handleToggleSection(sectionId)}
            >
              <Form {...projForm}>
                <form className="space-y-6">
                  {projFields.map((field, index) => (
                    <div key={field.id} className="relative p-4 border border-border rounded-lg bg-background group">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeProj(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <FormField control={projForm.control} name={`projects.${index}.name`} render={({ field }) => (
                          <FormItem className="sm:col-span-2"><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={projForm.control} name={`projects.${index}.description`} render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea className="min-h-[80px]" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={projForm.control} name={`projects.${index}.technologiesString`} render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Technologies (comma separated)</FormLabel>
                            <FormControl><Input placeholder="React, TypeScript, CSS" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={projForm.control} name={`projects.${index}.repository`} render={({ field }) => (
                          <FormItem><FormLabel>Repository URL</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={projForm.control} name={`projects.${index}.demo`} render={({ field }) => (
                          <FormItem><FormLabel>Demo URL</FormLabel><FormControl><Input placeholder="https://demo.com" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendProj({ id: `proj_${Date.now()}`, name: '', description: '', technologies: [], technologiesString: '', repository: '', demo: '' })} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                  <div className="flex justify-end pt-4 border-t border-border mt-4">
                    <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                      Save & Next
                    </Button>
                  </div>
                </form>
              </Form>
            </SectionEditorWrapper>
          )
        }

        if (sectionId === 'skills') {
          return (
            <SectionEditorWrapper 
              key={sectionId} 
              id={sectionId} 
              title="Skills"
              isExpanded={activeSection === sectionId}
              onToggle={() => handleToggleSection(sectionId)}
            >
              <Form {...skillForm}>
                <form className="space-y-6">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="relative p-4 border border-border rounded-lg bg-background group">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <FormField control={skillForm.control} name={`skills.${index}.category`} render={({ field }) => (
                          <FormItem><FormLabel>Skill Category</FormLabel><FormControl><Input placeholder="e.g. Frontend, Backend, Tools" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={skillForm.control} name={`skills.${index}.itemsString`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills (comma separated)</FormLabel>
                            <FormControl><Input placeholder="React, Next.js, Tailwind" {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendSkill({ id: `skill_${Date.now()}`, category: '', items: [], itemsString: '' })} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Skill Category
                  </Button>
                  <div className="flex justify-end pt-4 border-t border-border mt-4">
                    <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                      Save & Next
                    </Button>
                  </div>
                </form>
              </Form>
            </SectionEditorWrapper>
          )
        }

        if (sectionId === 'custom') {
          return (
            <SectionEditorWrapper 
              key={sectionId} 
              id={sectionId} 
              title="Custom Section"
              isExpanded={activeSection === sectionId}
              onToggle={() => handleToggleSection(sectionId)}
            >
              <Form {...customForm}>
                <form className="space-y-4">
                  <FormField control={customForm.control} name="custom.title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl><Input placeholder="e.g. Publications, Volunteer Work" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={customForm.control} name="custom.content" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl><Textarea className="min-h-[120px]" placeholder="Add whatever you want here..." {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <div className="flex justify-end pt-4 border-t border-border mt-4">
                    <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                      Save & Next
                    </Button>
                  </div>
                </form>
              </Form>
            </SectionEditorWrapper>
          )
        }

        // Render simple stubs for other sections just to allow reordering test
        return (
          <SectionEditorWrapper 
            key={sectionId} 
            id={sectionId} 
            title={sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
            isExpanded={activeSection === sectionId}
            onToggle={() => handleToggleSection(sectionId)}
          >
            <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-md">
              {sectionId} editor is under construction.
            </div>
            <div className="flex justify-end pt-4 border-t border-border mt-4">
              <Button type="button" onClick={() => handleSaveAndNext(sectionId)} className="bg-pine text-white hover:bg-pine/90 font-medium">
                Save & Next
              </Button>
            </div>
          </SectionEditorWrapper>
        )
      })}
    </div>
  )
}
