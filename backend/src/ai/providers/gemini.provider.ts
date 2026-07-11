import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './ai-provider.interface';

@Injectable()
export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' });
  }

  async generateSummary(resumeData: any): Promise<string[]> {
    const prompt = `Generate 3 different variations of a professional resume summary based on this data: ${JSON.stringify(resumeData)}. Return them as a JSON array of strings. ONLY output the valid JSON array, no markdown formatting like \`\`\`json.`;
    const response = await this.callGemini(prompt);
    try {
      const match = response.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : ["An experienced professional with a strong track record of success."];
    } catch {
      return ["An experienced professional with a strong track record of success."];
    }
  }

  async rewriteSection(sectionData: any, instructions?: string): Promise<string[]> {
    const prompt = `Rewrite this resume section to be more professional and impactful. Provide 3 different variations. ${instructions ? 'Instructions: ' + instructions : ''}\nData: ${JSON.stringify(sectionData)}. Return them as a JSON array of strings. ONLY output the valid JSON array.`;
    const response = await this.callGemini(prompt);
    try {
      const match = response.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : ["Rewritten text unavailable."];
    } catch {
      return ["Rewritten text unavailable."];
    }
  }

  async improveGrammar(text: string): Promise<string> {
    const prompt = `Correct the grammar and spelling of this text, making it sound professional. Return ONLY the corrected text.\nText: ${text}`;
    return this.callGemini(prompt);
  }

  async generateAchievements(role: string, company: string): Promise<string[]> {
    const prompt = `Generate 3 strong, quantifiable resume bullet points for a ${role} at ${company}. Output as a JSON array of strings. ONLY JSON array.`;
    const response = await this.callGemini(prompt);
    try {
      const match = response.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch {
      return [response];
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new InternalServerErrorException({ code: 'AI_001', message: 'Provider unavailable' });
    }
  }
}
