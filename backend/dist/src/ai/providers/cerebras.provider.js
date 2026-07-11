"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerebrasProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cerebras_cloud_sdk_1 = __importDefault(require("@cerebras/cerebras_cloud_sdk"));
let CerebrasProvider = class CerebrasProvider {
    configService;
    client;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('CEREBRAS_API_KEY') || '';
        this.client = new cerebras_cloud_sdk_1.default({ apiKey });
    }
    async generateSummary(resumeData) {
        const prompt = `Generate 3 different variations of a professional resume summary based on this data: ${JSON.stringify(resumeData)}. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.`;
        try {
            const response = await this.callCerebras(prompt);
            const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
            return JSON.parse(jsonStr);
        }
        catch (e) {
            console.error('Failed to parse summary from Cerebras:', e);
            return ["An experienced professional with a strong track record of success."];
        }
    }
    async rewriteSection(text, instructions) {
        const prompt = instructions
            ? `Rewrite the following resume section according to these instructions: "${instructions}". Provide 3 different variations. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.\n\nSection text: "${text}".`
            : `Professionally rewrite and improve the following resume section. Make it sound more impactful and action-oriented. Provide 3 different variations. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.\n\nSection text: "${text}".`;
        try {
            const response = await this.callCerebras(prompt);
            const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
            return JSON.parse(jsonStr);
        }
        catch (e) {
            console.error('Failed to parse rewrite from Cerebras:', e);
            return [text];
        }
    }
    async improveGrammar(text) {
        const prompt = `Fix any grammar, spelling, or punctuation errors in the following text while maintaining its original meaning. Return ONLY the corrected text.\n\nText: "${text}"`;
        return this.callCerebras(prompt);
    }
    async generateAchievements(role, company) {
        const prompt = `Generate 3-5 impressive, quantifiable achievements for a "${role}" at "${company}". Each achievement should start with an action verb. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.`;
        try {
            const response = await this.callCerebras(prompt);
            const jsonStr = response.replace(/^```json/i, '').replace(/```$/, '').trim();
            return JSON.parse(jsonStr);
        }
        catch (e) {
            console.error('Failed to parse achievements from Cerebras:', e);
            return [
                'Spearheaded key initiatives resulting in measurable improvements.',
                'Collaborated with cross-functional teams to deliver projects on time.',
                'Optimized processes to increase efficiency and reduce costs.'
            ];
        }
    }
    async callCerebras(prompt) {
        try {
            const response = await this.client.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gemma-4-31b',
                max_tokens: 1000,
            });
            return response.choices[0]?.message?.content?.trim() || '';
        }
        catch (error) {
            console.error("Cerebras API Error:", error);
            throw new common_1.InternalServerErrorException({ code: 'AI_001', message: 'Provider unavailable' });
        }
    }
    async parseResumeFromText(text) {
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
        }
        catch (e) {
            console.error('Failed to parse resume text from Cerebras:', e);
            return {};
        }
    }
};
exports.CerebrasProvider = CerebrasProvider;
exports.CerebrasProvider = CerebrasProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CerebrasProvider);
//# sourceMappingURL=cerebras.provider.js.map