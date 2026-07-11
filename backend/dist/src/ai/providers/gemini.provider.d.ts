import { ConfigService } from '@nestjs/config';
import { AIProvider } from './ai-provider.interface';
export declare class GeminiProvider implements AIProvider {
    private configService;
    private genAI;
    private model;
    constructor(configService: ConfigService);
    generateSummary(resumeData: any): Promise<string[]>;
    rewriteSection(sectionData: any, instructions?: string): Promise<string[]>;
    improveGrammar(text: string): Promise<string>;
    generateAchievements(role: string, company: string): Promise<string[]>;
    private callGemini;
}
