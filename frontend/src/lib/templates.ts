import { Resume } from "@/types"

export const TEMPLATES = [
  { id: 'classic', name: 'Classic', desc: 'Clean, traditional layout perfect for corporate roles', color: 'bg-slate-200', recommended: false },
  { id: 'modern', name: 'Modern', desc: 'Bold accents with a sleek, contemporary design', color: 'bg-blue-100 border-t-4 border-blue-600', recommended: true },
  { id: 'minimal', name: 'Minimal', desc: 'Elegant design focusing solely on content', color: 'bg-stone-100', recommended: false },
  { id: 'creative', name: 'Creative', desc: 'Two-column layout with a distinct sidebar', color: 'bg-teal-50 border-l-8 border-teal-700', recommended: false },
  { id: 'professional', name: 'Professional', desc: 'Structured and highly readable layout', color: 'bg-indigo-50 border-t-8 border-indigo-900', recommended: true },
  { id: 'elegant', name: 'Elegant', desc: 'Beautiful serif typography with centered headers', color: 'bg-rose-50', recommended: false },
  { id: 'bold', name: 'Bold', desc: 'High contrast design to stand out', color: 'bg-black text-white', recommended: true },
  { id: 'grid-classic', name: 'Grid Classic', desc: 'Clean, structured layout with a 2-column skills grid', color: 'bg-slate-100 border-t-2 border-slate-300', recommended: true },
  { id: 'grid-modern', name: 'Grid Modern', desc: 'Modern layout featuring a bold blue accent and grid skills', color: 'bg-blue-50 border-4 border-blue-600', recommended: true },
  { id: 'profile-classic', name: 'Profile Classic', desc: 'Clean layout featuring a profile picture', color: 'bg-zinc-50 border-2 border-zinc-200', recommended: true },
  { id: 'profile-modern', name: 'Profile Modern', desc: 'Modern layout with an accented profile picture header', color: 'bg-teal-50 border-l-8 border-teal-600', recommended: true },
  { id: 'rn-modern', name: 'RN Modern', desc: 'Sleek two-column design with a sidebar for contact, skills, and education. Resume-Now style.', color: 'bg-slate-100 border-l-4 border-slate-600', recommended: true },
  { id: 'rn-classic', name: 'RN Classic', desc: 'Highly structured ATS-friendly layout with clean typography. Resume-Now style.', color: 'bg-white border-t-2 border-gray-400', recommended: true },
  { id: 'rn-accent', name: 'RN Accent', desc: 'Bold colored header that makes your name stand out. Resume-Now style.', color: 'bg-indigo-50 border-t-8 border-indigo-700', recommended: true },
]

export const dummyResumeData: Resume = {
  id: "dummy",
  title: "Dummy Resume",
  status: "ACTIVE",
  templateId: "classic",
  personalInfo: {
    fullName: "Diya Agarwal",
    email: "d.agarwal@example.in",
    phone: "+91 11 5555 3345",
    location: "New Delhi, India 110034",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  professionalSummary: "Customer-focused Retail Sales professional with solid understanding of retail dynamics, marketing and customer service. Offering 5 years of experience providing quality product recommendations and solutions to meet customer needs and exceed expectations. Demonstrated record of exceeding revenue targets by leveraging communication skills and sales expertise.",
  experience: [
    {
      id: "exp1",
      company: "ZARA",
      role: "Retail Sales Associate",
      location: "New Delhi, India",
      startDate: "02/2017",
      endDate: "Current",
      current: true,
      bullets: [
        "Increased monthly sales 10% by effectively upselling and cross-selling products to maximize profitability.",
        "Prevented store losses by leveraging awareness, attention to detail, and integrity to identify and investigate concerns.",
        "Processed payments and maintained accurate drawers to meet financial targets."
      ]
    },
    {
      id: "exp2",
      company: "Dunkin' Donuts",
      role: "Barista",
      location: "New Delhi, India",
      startDate: "05/2015",
      endDate: "01/2017",
      current: false,
      bullets: [
        "Upsold seasonal drinks and pastries, boosting average store sales by ₹1500 weekly.",
        "Managed morning rush of over 300 customers daily with efficient, levelheaded customer service.",
        "Trained entire staff of 15 baristas in new smoothie program offerings and procedures."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Oxford Software Institute & Oxford School of English",
      degree: "Diploma",
      field: "Financial Accounting",
      startYear: "2013",
      endYear: "2016",
      grade: "New Delhi, India"
    }
  ],
  skills: [
    {
      id: "sk1",
      category: "Skills",
      items: ["Cash register operation", "POS system operation", "Sales expertise", "Teamwork", "Inventory management", "Accurate money handling", "Documentation and recordkeeping", "Retail merchandising expertise"]
    }
  ],
  languages: [
    {
      id: "lang1",
      name: "English",
      proficiency: "FLUENT"
    },
    {
      id: "lang2",
      name: "Hindi",
      proficiency: "NATIVE"
    }
  ],
  projects: [],
  certifications: [],
  achievements: [],
  positions: [],
  interests: [],
  sectionOrder: ["professionalSummary", "skills", "experience", "education", "languages"],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString()
}
