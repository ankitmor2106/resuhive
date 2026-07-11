import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class ExportsService {
    private readonly prisma;
    private readonly storageService;
    private readonly logger;
    constructor(prisma: PrismaService, storageService: StorageService);
    generatePdf(resumeId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ExportStatus;
        resumeId: string;
        fileUrl: string | null;
    }>;
    getExportStatus(exportId: string, userId: string): Promise<{
        resume: {
            id: string;
            experience: import("@prisma/client/runtime/client").JsonValue | null;
            skills: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            status: import("@prisma/client").$Enums.ResumeStatus;
            templateId: string | null;
            professionalSummary: string | null;
            sectionOrder: import("@prisma/client/runtime/client").JsonValue | null;
            personalInfo: import("@prisma/client/runtime/client").JsonValue | null;
            education: import("@prisma/client/runtime/client").JsonValue | null;
            projects: import("@prisma/client/runtime/client").JsonValue | null;
            certifications: import("@prisma/client/runtime/client").JsonValue | null;
            achievements: import("@prisma/client/runtime/client").JsonValue | null;
            positions: import("@prisma/client/runtime/client").JsonValue | null;
            languages: import("@prisma/client/runtime/client").JsonValue | null;
            interests: import("@prisma/client/runtime/client").JsonValue | null;
            custom: import("@prisma/client/runtime/client").JsonValue | null;
            theme: import("@prisma/client/runtime/client").JsonValue | null;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ExportStatus;
        resumeId: string;
        fileUrl: string | null;
    }>;
}
