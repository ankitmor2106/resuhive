export interface AIProvider {
    generateSummary(resumeData: any): Promise<string[]>;
    rewriteSection(sectionData: any, instructions?: string): Promise<string[]>;
    improveGrammar(text: string): Promise<string>;
    generateAchievements(role: string, company: string): Promise<string[]>;
}
