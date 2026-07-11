export declare enum ResumeStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}
export declare class CreateResumeDto {
    title?: string;
}
export declare class UpdateResumeDto {
    title?: string;
    status?: ResumeStatus;
    templateId?: string;
    professionalSummary?: string;
    sectionOrder?: string[];
    personalInfo?: any;
    experience?: any;
    education?: any;
    projects?: any;
    skills?: any;
    certifications?: any;
    achievements?: any;
    positions?: any;
    languages?: any;
    interests?: any;
    custom?: any;
    theme?: any;
}
