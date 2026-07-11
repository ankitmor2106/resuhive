import { Resume, User, ATSAnalysis, JDMatch } from '@/types'

export const MOCK_USER: User = {
  id: 'usr_123',
  email: 'demo@example.com',
  fullName: 'Sarah Jenkins',
  updatedAt: new Date().toISOString(),
  authProvider: 'EMAIL',
  profileCompleted: true,
  createdAt: new Date().toISOString(),
}

export const MOCK_RESUMES: Resume[] = [
  {
    id: 'res_1',
    title: 'Senior PM - Tech',
    status: 'ACTIVE',
    templateId: 'classic',
    personalInfo: {
      fullName: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/sjenkins',
      github: '',
    },
    professionalSummary:
      'Product Manager with 8+ years of experience leading cross-functional teams to deliver enterprise SaaS products. Proven track record of increasing user adoption by 40% and generating $5M+ in new ARR. Passionate about data-driven decision making and user-centric design.',
    experience: [
      {
        id: 'exp_1',
        company: 'CloudScale Solutions',
        role: 'Senior Product Manager',
        location: 'San Francisco, CA',
        startDate: '2020-03',
        endDate: '',
        current: true,
        bullets: [
          'Led a team of 12 engineers and 3 designers to launch a new enterprise analytics dashboard.',
          'Increased customer retention by 25% within the first 6 months of product launch.',
          'Conducted 50+ user interviews to identify key pain points and define the product roadmap.',
        ],
      },
      {
        id: 'exp_2',
        company: 'Nexus Technologies',
        role: 'Product Manager',
        location: 'Austin, TX',
        startDate: '2016-06',
        endDate: '2020-02',
        current: false,
        bullets: [
          'Managed the end-to-end lifecycle of a B2B marketing automation tool.',
          'Collaborated with sales and marketing to define go-to-market strategies, resulting in a 30% increase in lead generation.',
        ],
      },
    ],
    education: [
      {
        id: 'edu_1',
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startYear: '2012',
        endYear: '2016',
        grade: '3.8 GPA',
      },
    ],
    projects: [],
    skills: [
      {
        id: 'sk_1',
        category: 'Product Management',
        items: ['Agile/Scrum', 'Roadmapping', 'A/B Testing', 'User Research'],
      },
      {
        id: 'sk_2',
        category: 'Tools',
        items: ['Jira', 'Figma', 'Mixpanel', 'SQL'],
      },
    ],
    certifications: [],
    achievements: [],
    positions: [],
    languages: [],
    interests: [],
    sectionOrder: [
      'personalInfo',
      'professionalSummary',
      'experience',
      'education',
      'skills',
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'res_2',
    title: 'Frontend Engineer',
    status: 'DRAFT',
    templateId: 'modern',
    personalInfo: {
      fullName: 'Marcus Chen',
      email: 'mchen.dev@example.com',
      phone: '(555) 987-6543',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/marcuschen',
      github: 'github.com/marcuschen',
    },
    professionalSummary:
      'Frontend Engineer with 4 years of experience building responsive, accessible web applications using React and TypeScript. Adept at collaborating with designers to create intuitive user interfaces and optimizing performance for high-traffic sites.',
    experience: [
      {
        id: 'exp_3',
        company: 'FinTech Startup',
        role: 'Frontend Developer',
        location: 'New York, NY',
        startDate: '2021-05',
        endDate: '',
        current: true,
        bullets: [
          'Architected a new trading dashboard using React, Redux, and Tailwind CSS, reducing load times by 40%.',
          'Implemented rigorous automated testing with Jest and Cypress, achieving 85% test coverage.',
        ],
      },
      {
        id: 'exp_4',
        company: 'Digital Agency',
        role: 'Junior Web Developer',
        location: 'Brooklyn, NY',
        startDate: '2019-08',
        endDate: '2021-04',
        current: false,
        bullets: [
          'Developed and maintained e-commerce websites for various clients using Vue.js and Next.js.',
          'Optimized images and assets to improve Core Web Vitals scores.',
        ],
      },
    ],
    education: [
      {
        id: 'edu_2',
        institution: 'New York University',
        degree: 'Bachelor of Arts',
        field: 'Digital Design',
        startYear: '2015',
        endYear: '2019',
      },
    ],
    projects: [],
    skills: [
      {
        id: 'sk_3',
        category: 'Languages & Frameworks',
        items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js'],
      },
      {
        id: 'sk_4',
        category: 'Styling',
        items: ['CSS', 'Sass', 'Tailwind CSS', 'Styled Components'],
      },
    ],
    certifications: [],
    achievements: [],
    positions: [],
    languages: [],
    interests: [],
    sectionOrder: [
      'personalInfo',
      'professionalSummary',
      'skills',
      'experience',
      'education',
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'res_3',
    title: 'Software Engineer (New Grad)',
    status: 'ARCHIVED',
    templateId: 'classic',
    personalInfo: {
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '(555) 246-8101',
      location: 'Seattle, WA',
      linkedin: 'linkedin.com/in/priyapatel',
      github: 'github.com/priyap',
    },
    professionalSummary:
      'Recent Computer Science graduate with a strong foundation in algorithms and software engineering principles. Experienced in developing full-stack applications through internships and academic projects. Eager to contribute to a collaborative engineering team.',
    experience: [
      {
        id: 'exp_5',
        company: 'Tech Innovations Inc.',
        role: 'Software Engineering Intern',
        location: 'Seattle, WA',
        startDate: '2023-05',
        endDate: '2023-08',
        current: false,
        bullets: [
          'Developed a RESTful API using Node.js and Express to process customer feedback.',
          'Collaborated with senior engineers to migrate a legacy database to PostgreSQL, improving query performance by 20%.',
        ],
      },
    ],
    education: [
      {
        id: 'edu_3',
        institution: 'University of Washington',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startYear: '2020',
        endYear: '2024',
        grade: '3.9 GPA',
      },
    ],
    projects: [
      {
        id: 'proj_1',
        name: 'Smart Campus App',
        description: 'A mobile app for students to navigate campus facilities and events.',
        technologies: ['React Native', 'Firebase', 'Google Maps API'],
        repository: 'github.com/priyap/smart-campus',
      },
    ],
    skills: [
      {
        id: 'sk_5',
        category: 'Languages',
        items: ['Java', 'Python', 'JavaScript', 'C++'],
      },
      {
        id: 'sk_6',
        category: 'Technologies',
        items: ['Node.js', 'React', 'PostgreSQL', 'Git'],
      },
    ],
    certifications: [],
    achievements: [],
    positions: [
      {
        id: 'pos_1',
        role: 'President',
        organization: 'Women in Computing',
        startDate: '2022-09',
        endDate: '2024-05',
        current: false,
        bullets: [
          'Organized 15+ workshops and networking events with industry professionals.',
          'Grew club membership by 50% over two years.',
        ],
      },
    ],
    languages: [],
    interests: [],
    sectionOrder: [
      'personalInfo',
      'education',
      'experience',
      'projects',
      'skills',
      'positions',
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
]
