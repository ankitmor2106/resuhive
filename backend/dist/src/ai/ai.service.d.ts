import { PrismaService } from '../prisma/prisma.service';
import { CerebrasProvider } from './providers/cerebras.provider';
export declare class AiService {
    private readonly prisma;
    private readonly aiProvider;
    constructor(prisma: PrismaService, aiProvider: CerebrasProvider);
    requestSuggestion(resumeId: string, userId: string, type: any, data: any): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.SuggestionType;
        targetSectionId: any;
        original: string;
        suggested: string;
        status: string;
    }[]>;
    applySuggestion(suggestionId: string, userId: string): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.SuggestionType;
        targetSectionId: string;
        original: string;
        suggested: string;
        status: string;
    }>;
    rejectSuggestion(suggestionId: string, userId: string): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.SuggestionType;
        targetSectionId: string;
        original: string;
        suggested: string;
        status: string;
    }>;
    parseResumeFromText(text: string): Promise<any>;
}
