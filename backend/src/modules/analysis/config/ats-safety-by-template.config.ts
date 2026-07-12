export interface TemplateAtsSafety {
  templateId: string;
  atsSafe: boolean;
  risks: string[];
}

export const TEMPLATE_ATS_SAFETY: Record<string, TemplateAtsSafety> = {
  'minimal-classic': { templateId: 'minimal-classic', atsSafe: true, risks: [] },
  'two-column-modern': {
    templateId: 'two-column-modern',
    atsSafe: false,
    risks: ['multi-column layout can reorder or drop content in some parsers'],
  },
};
