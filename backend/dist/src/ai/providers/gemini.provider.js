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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiProvider = class GeminiProvider {
    configService;
    genAI;
    model;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY') || '';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' });
    }
    async generateSummary(resumeData) {
        const prompt = `Generate 3 different variations of a professional resume summary based on this data: ${JSON.stringify(resumeData)}. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.`;
        const response = await this.callGemini(prompt);
        try {
            const match = response.match(/\[.*\]/s);
            return match ? JSON.parse(match[0]) : ["An experienced professional with a strong track record of success."];
        }
        catch {
            return ["An experienced professional with a strong track record of success."];
        }
    }
    async rewriteSection(sectionData, instructions) {
        const prompt = `Rewrite this resume section to be more professional and impactful. Provide 3 different variations. ${instructions ? 'Instructions: ' + instructions : ''}\nData: ${JSON.stringify(sectionData)}. Return them as a JSON array of strings. ONLY output the valid JSON array.`;
        const response = await this.callGemini(prompt);
        try {
            const match = response.match(/\[.*\]/s);
            return match ? JSON.parse(match[0]) : ["Rewritten text unavailable."];
        }
        catch {
            return ["Rewritten text unavailable."];
        }
    }
    async improveGrammar(text) {
        const prompt = `Correct the grammar and spelling of this text, making it sound professional. Return ONLY the corrected text.\nText: ${text}`;
        return this.callGemini(prompt);
    }
    async generateAchievements(role, company) {
        const prompt = `Generate 3 strong, quantifiable resume bullet points for a ${role} at ${company}. Output as a JSON array of strings. ONLY JSON array.`;
        const response = await this.callGemini(prompt);
        try {
            const match = response.match(/\[.*\]/s);
            return match ? JSON.parse(match[0]) : [];
        }
        catch {
            return [response];
        }
    }
    async callGemini(prompt) {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        }
        catch (error) {
            console.error("Gemini API Error:", error);
            throw new common_1.InternalServerErrorException({ code: 'AI_001', message: 'Provider unavailable' });
        }
    }
};
exports.GeminiProvider = GeminiProvider;
exports.GeminiProvider = GeminiProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiProvider);
//# sourceMappingURL=gemini.provider.js.map