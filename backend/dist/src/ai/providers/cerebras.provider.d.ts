import { ConfigService } from '@nestjs/config';
import { AIProvider } from './ai-provider.interface';
export declare class CerebrasProvider implements AIProvider {
    private configService;
    private client;
    constructor(configService: ConfigService);
    generateSummary(resumeData: any): Promise<string[]>;
    rewriteSection(text: string, instructions?: string): Promise<string[]>;
    improveGrammar(text: string): Promise<string>;
    generateAchievements(role: string, company: string): Promise<string[]>;
    private callCerebras;
    parseResumeFromText(text: string): Promise<any>;
}
