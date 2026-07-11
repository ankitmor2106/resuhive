import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { AIProvider } from './ai-provider.interface';

@Injectable()
export class CerebrasProvider implements AIProvider {
  private client: Cerebras;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CEREBRAS_API_KEY') || '';
    this.client = new Cerebras({ apiKey });
  }

  async generateSummary(resumeData: any): Promise<string[]> {
    const prompt = `Generate 3 different variations of a professional resume summary based on this data: ${JSON.stringify(resumeData)}. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.`;
    try {
      const response = await this.callCerebras(prompt);
      const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse summary from Cerebras:', e);
      return ["An experienced professional with a strong track record of success."];
    }
  }

  async rewriteSection(text: string, instructions?: string): Promise<string[]> {
    const prompt = instructions 
      ? `Rewrite the following resume section according to these instructions: "${instructions}". Provide 3 different variations. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.\n\nSection text: "${text}".`
      : `Professionally rewrite and improve the following resume section. Make it sound more impactful and action-oriented. Provide 3 different variations. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.\n\nSection text: "${text}".`;
    try {
      const response = await this.callCerebras(prompt);
      const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse rewrite from Cerebras:', e);
      return [text];
    }
  }

  async improveGrammar(text: string): Promise<string> {
    const prompt = `Fix any grammar, spelling, or punctuation errors in the following text while maintaining its original meaning. Return ONLY the corrected text.\n\nText: "${text}"`;
    return this.callCerebras(prompt);
  }

  async generateAchievements(role: string, company: string): Promise<string[]> {
    const prompt = `Generate 3-5 impressive, quantifiable achievements for a "${role}" at "${company}". Each achievement should start with an action verb. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.`;
    
    try {
      const response = await this.callCerebras(prompt);
      const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse achievements from Cerebras:', e);
      return [
        'Spearheaded key initiatives resulting in measurable improvements.',
        'Collaborated with cross-functional teams to deliver projects on time.',
        'Optimized processes to increase efficiency and reduce costs.'
      ];
    }
  }

  private async callCerebras(prompt: string): Promise<string> {
    try {
      const response: any = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gemma-4-31b',
        max_tokens: 1000,
      });
      return response.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error("Cerebras API Error:", error);
      throw new InternalServerErrorException({ code: 'AI_001', message: 'Provider unavailable' });
    }
  }

  async parseResumeFromText(text: string): Promise<any> {
    const prompt = `You are an expert ATS resume parser. Extract the following details from the resume text below and return ONLY a valid JSON object matching this structure:
{
  "title": "A short title for this resume based on the person's role",
  "personalInfo": {
    "fullName": "Full name",
    "email": "Email address",
    "phone": "Phone number",
    "location": "City, Country",
    "linkedin": "LinkedIn URL (if any)",
    "github": "GitHub URL (if any)",
    "website": "Personal website (if any)"
  },
  "professionalSummary": "A concise summary of their professional background",
  "experience": [
    {
      "id": "generate-a-unique-uuid-here",
      "company": "Company Name",
      "role": "Job Title",
      "location": "Location",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Current",
      "current": boolean,
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "id": "generate-a-unique-uuid-here",
      "institution": "University/School",
      "degree": "Degree (e.g. BS)",
      "field": "Field of Study",
      "startYear": "YYYY",
      "endYear": "YYYY",
      "grade": "GPA or Grade"
    }
  ],
  "skills": [
    {
      "id": "generate-a-unique-uuid-here",
      "category": "e.g. Languages, Frameworks, Tools",
      "items": ["Skill 1", "Skill 2"]
    }
  ]
}

Ensure all IDs are generated randomly (e.g., using a short random string or UUID format). Do not include any other markdown formatting like \`\`\`json. Return ONLY the raw JSON string.

Resume Text:
"""
${text.substring(0, 8000)}
"""`;

    try {
      const response = await this.callCerebras(prompt);
      const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse resume text from Cerebras:', e);
      return {};
    }
  }
}
