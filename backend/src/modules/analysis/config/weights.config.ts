export type CategoryKey = 'professionalSummary' | 'workExperience' | 'skillsKeywords' | 'formattingStructure' | 'impactReadability' | 'contactInformation' | 'education' | 'projects';

export interface WeightProfile {
  id: string;
  label: string;
  weights: Partial<Record<CategoryKey, number>>;
}

export const DEFAULT_PROFILE: WeightProfile = {
  id: 'default',
  label: 'General',
  weights: {
    workExperience: 0.25,
    skillsKeywords: 0.20,
    professionalSummary: 0.15,
    contactInformation: 0.10,
    education: 0.10,
    formattingStructure: 0.10,
    impactReadability: 0.10,
  },
};

export const TECHNICAL_PROFILE: WeightProfile = {
  id: 'technical',
  label: 'Software / Engineering',
  weights: {
    workExperience: 0.25,
    skillsKeywords: 0.25,
    professionalSummary: 0.10,
    contactInformation: 0.05,
    education: 0.10,
    formattingStructure: 0.10,
    impactReadability: 0.15,
  },
};

export const ENTRY_LEVEL_PROFILE: WeightProfile = {
  id: 'entry-level',
  label: 'Intern / New Grad',
  weights: {
    workExperience: 0.10,
    skillsKeywords: 0.15,
    professionalSummary: 0.20,
    contactInformation: 0.10,
    education: 0.25,
    formattingStructure: 0.10,
    impactReadability: 0.10,
  },
};

export const WEIGHT_PROFILES: Record<string, WeightProfile> = {
  default: DEFAULT_PROFILE,
  technical: TECHNICAL_PROFILE,
  'entry-level': ENTRY_LEVEL_PROFILE,
};
