import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    requestSuggestion(resumeId: string, user: {
        userId: string;
    }, body: any): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.SuggestionType;
        targetSectionId: any;
        original: string;
        suggested: string;
        status: string;
    }[]>;
    applySuggestion(suggestionId: string, user: {
        userId: string;
    }): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.SuggestionType;
        targetSectionId: string;
        original: string;
        suggested: string;
        status: string;
    }>;
    rejectSuggestion(suggestionId: string, user: {
        userId: string;
    }): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.SuggestionType;
        targetSectionId: string;
        original: string;
        suggested: string;
        status: string;
    }>;
}
