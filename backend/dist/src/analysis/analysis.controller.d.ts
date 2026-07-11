import { AnalysisService } from './analysis.service';
import { MatchJDDto } from './dto/analysis.dto';
export declare class AnalysisController {
    private readonly analysisService;
    constructor(analysisService: AnalysisService);
    analyzeAts(resumeId: string, user: {
        userId: string;
    }): Promise<{
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
    matchJd(resumeId: string, user: {
        userId: string;
    }, dto: MatchJDDto): Promise<{
        resumeId: string;
        matchPercentage: number;
        matchingSkills: string[];
        missingSkills: string[];
        missingKeywords: string[];
        experienceGaps: string[];
        suggestedImprovements: string[];
    }>;
}
