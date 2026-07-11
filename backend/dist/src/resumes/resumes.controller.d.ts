import { ResumesService } from './resumes.service';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
export declare class ResumesController {
    private readonly resumesService;
    constructor(resumesService: ResumesService);
    importResume(user: {
        userId: string;
    }, file: Express.Multer.File): Promise<{
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
    }>;
    create(user: {
        userId: string;
    }, createResumeDto: CreateResumeDto): Promise<{
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
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
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
    }[]>;
    findOne(id: string, user: {
        userId: string;
    }): Promise<{
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
    }>;
    update(id: string, user: {
        userId: string;
    }, updateResumeDto: UpdateResumeDto): Promise<{
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
    }>;
    remove(id: string, user: {
        userId: string;
    }): Promise<void>;
}
