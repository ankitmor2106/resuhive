import { PrismaService } from '../prisma/prisma.service';
import { MatchJDDto } from './dto/analysis.dto';
export declare class AnalysisService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    analyzeResume(resumeId: string, userId: string): Promise<{
        resumeId: string;
        overallScore: number;
        categories: {
            name: string;
            weight: number;
            score: number;
            issues: string[];
        }[];
        recommendations: string[];
        createdAt: string;
    }>;
    matchJobDescription(resumeId: string, userId: string, dto: MatchJDDto): Promise<{
        resumeId: string;
        matchPercentage: number;
        matchingSkills: string[];
        missingSkills: string[];
        missingKeywords: string[];
        experienceGaps: string[];
        suggestedImprovements: string[];
    }>;
    private calculateAtsScore;
    private calculateJdMatch;
}
