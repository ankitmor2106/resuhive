"use client"

import { Resume } from "@/types"

interface LivePreviewProps {
  resume: Resume
}

export function LivePreview({ resume }: LivePreviewProps) {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    projects,
    skills,
    custom,
    sectionOrder,
    templateId
  } = resume

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return null; // Handled at top
      case 'professionalSummary':
        if (!professionalSummary) return null;
        return (
          <div key="summary" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{professionalSummary}</p>
          </div>
        )
      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key="experience" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">Experience</h2>
            <div className="flex flex-col gap-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold">{exp.role}</h3>
                    <span className="font-system text-xs text-muted-foreground">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="text-sm italic">{exp.company}</div>
                    <span className="text-xs text-muted-foreground">{exp.location}</span>
                  </div>
                  <ul className="list-disc pl-4 text-sm leading-relaxed space-y-1">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )
      case 'education':
        if (!education?.length) return null;
        return (
          <div key="education" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">Education</h2>
            <div className="flex flex-col gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                    <div className="text-sm">{edu.institution}</div>
                  </div>
                  <span className="font-system text-xs text-muted-foreground">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'skills':
        if (!skills?.length) return null;
        
        const isGridTemplate = templateId === 'grid-classic' || templateId === 'grid-modern';

        if (isGridTemplate) {
          return (
            <div key="skills" className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">Skills</h2>
              <div className="flex flex-col gap-4">
                {skills.map((group) => (
                  <div key={group.id}>
                    {group.category !== 'Skills' && <h3 className="font-semibold text-sm mb-1">{group.category}</h3>}
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm list-disc pl-4">
                      {group.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return (
          <div key="skills" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">Skills</h2>
            <div className="flex flex-col gap-1">
              {skills.map((group) => (
                <div key={group.id} className="text-sm">
                  <span className="font-semibold">{group.category}: </span>
                  {group.items.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )
      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key="projects" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold">{proj.name}</h3>
                    {proj.demo ? (
                      <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Demo</a>
                    ) : proj.repository ? (
                      <a href={proj.repository} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Repo</a>
                    ) : null}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-xs text-muted-foreground mb-1 font-medium">
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      case 'custom':
        if (!custom || (!custom.title && !custom.content)) return null;
        return (
          <div key="custom" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-mist pb-1">{custom.title || 'Custom Section'}</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{custom.content}</p>
          </div>
        )
      default:
        return null
    }
  }

  const theme = resume.theme || {};
  const fontClass = theme.fontFamily === 'serif' ? 'font-serif' : 
                    theme.fontFamily === 'mono' ? 'font-mono' : 
                    theme.fontFamily === 'inter' ? 'font-inter' : 
                    theme.fontFamily === 'playfair' ? 'font-playfair' : 
                    theme.fontFamily === 'roboto' ? 'font-roboto' : 
                    theme.fontFamily === 'lora' ? 'font-lora' : 
                    theme.fontFamily === 'sans' ? 'font-sans' : 
                    ''; // let template default if undefined
                    
  const spacingClass = theme.spacing === 'compact' ? 'p-6' : 
                       theme.spacing === 'relaxed' ? 'p-12' : 
                       theme.spacing === 'normal' ? 'p-8' : '';

  const primaryColor = theme.primaryColor || '';

  const renderTemplate = () => {
    switch (templateId) {
      case 'rn-modern':
        return (
          <div className={`resume-paper max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-sans'} flex`}>
            <div className={`w-1/3 bg-slate-50 ${spacingClass || 'p-8'} border-r border-slate-200 theme-bg-light`}>
              {personalInfo.photoUrl && (
                <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mx-auto mb-6 shadow-md border-4 border-white">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-slate-800 theme-text border-b-2 border-slate-300 pb-1">Contact</h2>
              <div className="flex flex-col gap-3 text-xs mb-8 text-slate-600 font-medium break-words">
                {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
                {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
                {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
                {personalInfo.github && <span>💻 {personalInfo.github}</span>}
              </div>
              
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => {
                  if (['skills', 'education', 'languages'].includes(sectionId)) {
                    return renderSection(sectionId);
                  }
                  return null;
                })}
              </div>
            </div>
            <div className={`w-2/3 ${spacingClass || 'p-8'}`}>
              <h1 className="text-4xl font-black mb-6 text-slate-900 theme-text tracking-tight uppercase">{personalInfo.fullName}</h1>
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => {
                  if (!['skills', 'education', 'languages', 'personalInfo'].includes(sectionId)) {
                    return renderSection(sectionId);
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        );
      case 'rn-classic':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-serif'}`}>
            <div className="flex flex-row items-center gap-6 mb-6">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-semibold mb-2 uppercase tracking-wide theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.location && (personalInfo.phone || personalInfo.email) && <span className="text-gray-300">|</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.phone && personalInfo.email && <span className="text-gray-300">|</span>}
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.linkedin && <span className="text-gray-300">|</span>}
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'rn-accent':
        return (
          <div className={`resume-paper max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-sans'}`}>
            <div className={`bg-indigo-700 text-white flex flex-row items-center gap-8 ${spacingClass || 'p-10'} mb-6 theme-bg`}>
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-indigo-100 font-medium">
                  {personalInfo.email && <span className="flex items-center gap-1.5">✉️ {personalInfo.email}</span>}
                  {personalInfo.phone && <span className="flex items-center gap-1.5">📱 {personalInfo.phone}</span>}
                  {personalInfo.location && <span className="flex items-center gap-1.5">📍 {personalInfo.location}</span>}
                  {personalInfo.linkedin && <span className="flex items-center gap-1.5">💼 {personalInfo.linkedin}</span>}
                </div>
              </div>
            </div>
            <div className={`px-8 pb-8 ${spacingClass ? (theme.spacing === 'compact' ? 'px-6 pb-6' : theme.spacing === 'relaxed' ? 'px-12 pb-12' : 'px-8 pb-8') : ''}`}>
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => renderSection(sectionId))}
              </div>
            </div>
          </div>
        );
      case 'professional':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto text-gray-800 ${fontClass || 'font-sans'} border-t-8 border-indigo-900 theme-border-t bg-white`}>
            <div className="flex flex-row items-center gap-6 mb-6 pb-4 border-b-2 border-indigo-100 theme-border-light">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-indigo-100">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-indigo-950 mb-2 uppercase theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-gray-600">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'elegant':
        return (
          <div className={`resume-paper ${spacingClass || 'p-10'} max-w-[850px] mx-auto bg-rose-50/30 text-gray-800 ${fontClass || 'font-serif'}`}>
            <div className="flex flex-row items-center gap-8 mb-8">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-rose-200">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-light tracking-widest text-gray-900 mb-3 theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 uppercase tracking-widest">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.email && personalInfo.phone && <span>•</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.phone && personalInfo.location && <span>•</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto bg-slate-900 text-slate-300 ${fontClass || 'font-mono'} border-l-4 border-green-500 theme-border-l theme-bg-dark`}>
            <div className="flex flex-row items-center gap-6 mb-8 pb-4 border-b border-slate-700 theme-border-light">
              {personalInfo.photoUrl && (
                <div className="w-20 h-20 rounded-md overflow-hidden shrink-0 border border-green-500 opacity-90">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover grayscale" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-green-400 mb-2 theme-text-accent">{'>'} {personalInfo.fullName}_</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 mt-2">
                  {personalInfo.email && <span>email: {personalInfo.email}</span>}
                  {personalInfo.phone && <span>tel: {personalInfo.phone}</span>}
                  {personalInfo.github && <span>github: {personalInfo.github}</span>}
                  {personalInfo.location && <span>loc: {personalInfo.location}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => (
                <div key={sectionId} className="mb-2">
                  {renderSection(sectionId)}
                </div>
              ))}
            </div>
          </div>
        );
      case 'bold':
        return (
          <div className={`resume-paper max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-sans'}`}>
            <div className={`bg-black text-white ${spacingClass || 'p-8'} mb-6 theme-bg flex items-center gap-6`}>
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-none overflow-hidden shrink-0 border-4 border-white">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
              </div>
            </div>
            <div className={`px-8 pb-8 ${spacingClass ? (theme.spacing === 'compact' ? 'px-6 pb-6' : theme.spacing === 'relaxed' ? 'px-12 pb-12' : 'px-8 pb-8') : ''}`}>
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => renderSection(sectionId))}
              </div>
            </div>
          </div>
        );
      case 'modern':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto bg-slate-50 text-slate-900 border-t-8 border-t-blue-600 theme-border-t ${fontClass || 'font-sans'}`}>
            <div className="flex flex-row items-center gap-8 mb-8 pb-6 border-b border-slate-300 theme-border-light">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-200">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 mb-2 theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-600">
                  {personalInfo.email && <span className="flex items-center">📧 {personalInfo.email}</span>}
                  {personalInfo.phone && <span className="flex items-center">📱 {personalInfo.phone}</span>}
                  {personalInfo.location && <span className="flex items-center">📍 {personalInfo.location}</span>}
                  {personalInfo.dateOfBirth && <span className="flex items-center">🎂 {personalInfo.dateOfBirth}</span>}
                  {personalInfo.linkedin && <span className="flex items-center">💼 {personalInfo.linkedin}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'minimal':
        return (
          <div className={`resume-paper ${spacingClass || 'p-12'} max-w-[850px] mx-auto bg-white text-gray-800 ${fontClass || 'font-sans'}`}>
            <div className="mb-10 flex gap-6 items-center">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover grayscale" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-light tracking-widest text-black mb-4 uppercase theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 tracking-wide uppercase">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className={`resume-paper max-w-[850px] mx-auto bg-slate-50 text-gray-900 ${fontClass || 'font-sans'} flex`}>
            <div className={`w-1/3 bg-teal-700 text-white ${spacingClass || 'p-8'} theme-bg`}>
              {personalInfo.photoUrl && (
                <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mb-6 border-4 border-white mx-auto shadow-md">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <h1 className="text-3xl font-bold mb-6">{personalInfo.fullName}</h1>
              <div className="flex flex-col gap-3 text-sm mb-10 text-teal-100">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
              </div>
            </div>
            <div className={`w-2/3 ${spacingClass || 'p-8'}`}>
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => renderSection(sectionId))}
              </div>
            </div>
          </div>
        );
      case 'executive':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-serif'}`}>
            <div className="flex flex-row items-center gap-6 mb-6 border-b-4 border-gray-900 pb-4 theme-border">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-sm overflow-hidden shrink-0 border-2 border-gray-900">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover grayscale" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 uppercase theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-sm font-sans text-gray-700">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.dateOfBirth && <span>{personalInfo.dateOfBirth}</span>}
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'grid-classic':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-sans'}`}>
            <div className="flex flex-row items-center gap-8 mb-8 pb-4 border-b border-gray-300 theme-border-light">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-gray-300">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-3 theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 uppercase tracking-widest">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'grid-modern':
        return (
          <div className={`resume-paper max-w-[850px] mx-auto bg-white text-gray-900 border-[8px] border-blue-600 theme-border ${fontClass || 'font-sans'}`}>
            <div className={`bg-blue-600 text-white ${spacingClass || 'p-8'} mb-6 theme-bg flex items-center gap-6`}>
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border-4 border-white shadow-sm">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                </div>
              </div>
            </div>
            <div className={`px-8 pb-8 ${spacingClass ? (theme.spacing === 'compact' ? 'px-6 pb-6' : theme.spacing === 'relaxed' ? 'px-12 pb-12' : 'px-8 pb-8') : ''}`}>
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => renderSection(sectionId))}
              </div>
            </div>
          </div>
        );
      case 'profile-classic':
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} max-w-[850px] mx-auto bg-white text-gray-900 ${fontClass || 'font-sans'}`}>
            <div className="flex flex-row items-center gap-6 mb-8 pb-4 border-b border-gray-300 theme-border-light">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-2 theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 uppercase tracking-widest">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
      case 'profile-modern':
        return (
          <div className={`resume-paper max-w-[850px] mx-auto bg-white text-gray-900 border-l-[12px] border-teal-600 theme-border-l ${fontClass || 'font-sans'}`}>
            <div className={`flex flex-col sm:flex-row bg-teal-50 ${spacingClass || 'p-8'} mb-6 border-b border-teal-100 theme-bg-light`}>
              {personalInfo.photoUrl && (
                <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 shadow-sm border-4 border-white mb-4 sm:mb-0 sm:mr-8">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-4xl font-black mb-2 text-teal-900 theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-col gap-1 text-sm text-teal-800">
                  {personalInfo.location && <span className="flex items-center gap-2">📍 {personalInfo.location}</span>}
                  {personalInfo.phone && <span className="flex items-center gap-2">📱 {personalInfo.phone}</span>}
                  {personalInfo.email && <span className="flex items-center gap-2">✉️ {personalInfo.email}</span>}
                </div>
              </div>
            </div>
            <div className={`px-8 pb-8 ${spacingClass ? (theme.spacing === 'compact' ? 'px-6 pb-6' : theme.spacing === 'relaxed' ? 'px-12 pb-12' : 'px-8 pb-8') : ''}`}>
              <div className="custom-template-content">
                {sectionOrder.map((sectionId) => renderSection(sectionId))}
              </div>
            </div>
          </div>
        );
      case 'classic':
      default:
        return (
          <div className={`resume-paper ${spacingClass || 'p-8'} w-full max-w-[850px] mx-auto bg-white text-ink ${fontClass || 'font-sans'}`}>
            <div className="flex flex-row items-center gap-6 mb-6 border-b-2 border-ink pb-4 theme-border">
              {personalInfo.photoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
                  <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1 theme-text">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-system text-muted-foreground">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.dateOfBirth && <span>{personalInfo.dateOfBirth}</span>}
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                  {personalInfo.github && <span>{personalInfo.github}</span>}
                </div>
              </div>
            </div>
            <div className="custom-template-content">
              {sectionOrder.map((sectionId) => renderSection(sectionId))}
            </div>
          </div>
        );
    }
  }

  return (
    <div 
      className="resume-paper-container w-full"
      style={primaryColor ? { '--primary-color': primaryColor } as React.CSSProperties : {}}
    >
      {primaryColor && (
        <style>{`
          .theme-border { border-color: var(--primary-color) !important; }
          .theme-border-t { border-top-color: var(--primary-color) !important; }
          .theme-border-l { border-left-color: var(--primary-color) !important; }
          .theme-border-light { border-color: color-mix(in srgb, var(--primary-color) 30%, transparent) !important; }
          .theme-text { color: var(--primary-color) !important; }
          .theme-text-accent { color: color-mix(in srgb, var(--primary-color) 80%, white) !important; }
          .theme-bg { background-color: var(--primary-color) !important; }
          .theme-bg-light { background-color: color-mix(in srgb, var(--primary-color) 10%, transparent) !important; }
          .theme-bg-dark { background-color: color-mix(in srgb, var(--primary-color) 15%, black) !important; }
          
          .custom-template-content h2 {
            color: var(--primary-color) !important;
            border-bottom-color: var(--primary-color) !important;
          }
        `}</style>
      )}
      {renderTemplate()}
    </div>
  );
}
