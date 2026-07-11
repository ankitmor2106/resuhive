"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
const pdfParse = require('pdf-parse');
let ResumesService = class ResumesService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async create(userId, createResumeDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const fullName = user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : (user.firstName || user.lastName || '');
        const dummyPersonalInfo = {
            fullName: fullName || "Diya Agarwal",
            email: user.email || "d.agarwal@example.in",
            phone: "+91 11 5555 3345",
            location: "New Delhi, India",
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
        };
        const dummySummary = "Customer-focused Retail Sales professional with solid understanding of retail dynamics, marketing and customer service. Offering 5 years of experience providing quality product recommendations and solutions to meet customer needs and exceed expectations.";
        const dummyExperience = [
            {
                id: crypto.randomUUID(),
                company: "ZARA",
                role: "Retail Sales Associate",
                location: "New Delhi, India",
                startDate: "02/2017",
                endDate: "Current",
                current: true,
                bullets: [
                    "Increased monthly sales 10% by effectively upselling and cross-selling products to maximize profitability.",
                    "Prevented store losses by leveraging awareness, attention to detail, and integrity to identify and investigate concerns."
                ]
            }
        ];
        if (user.experience) {
            dummyExperience.unshift({
                id: crypto.randomUUID(),
                company: 'Previous Company',
                role: user.occupation || 'Professional',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                bullets: [user.experience],
            });
        }
        const dummySkills = [
            {
                id: crypto.randomUUID(),
                category: "Skills",
                items: (user.skills && Array.isArray(user.skills) && user.skills.length > 0) ? user.skills : ["Cash register operation", "POS system operation", "Sales expertise", "Teamwork", "Inventory management"]
            }
        ];
        const dummyEducation = [
            {
                id: crypto.randomUUID(),
                institution: "Oxford Software Institute",
                degree: "Diploma",
                field: "Financial Accounting",
                startYear: "2013",
                endYear: "2016",
                grade: ""
            }
        ];
        return this.prisma.resume.create({
            data: {
                userId,
                title: createResumeDto.title || 'Untitled Resume',
                sectionOrder: ['personalInfo', 'professionalSummary', 'experience', 'education', 'skills', 'projects', 'custom'],
                personalInfo: dummyPersonalInfo,
                professionalSummary: user.occupation ? `Professional ${user.occupation} with experience in the field.` : dummySummary,
                experience: dummyExperience,
                education: dummyEducation,
                skills: dummySkills,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.resume.findMany({
            where: { userId, deletedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const resume = await this.prisma.resume.findFirst({
            where: { id, userId, deletedAt: null },
        });
        if (!resume) {
            throw new common_1.NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
        }
        return resume;
    }
    async update(id, userId, updateResumeDto) {
        await this.findOne(id, userId);
        return this.prisma.resume.update({
            where: { id },
            data: updateResumeDto,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        await this.prisma.resume.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async importResume(userId, file) {
        let text = '';
        if (file.mimetype === 'application/pdf') {
            try {
                const pdfData = await pdfParse(file.buffer);
                text = pdfData.text;
            }
            catch (err) {
                console.error('pdfParse error:', err);
                throw new common_1.BadRequestException('Failed to parse PDF file.');
            }
        }
        else {
            text = file.buffer.toString('utf-8');
        }
        if (!text || text.trim().length === 0) {
            throw new common_1.BadRequestException('No text could be extracted from the file.');
        }
        const parsedData = await this.aiService.parseResumeFromText(text);
        return this.prisma.resume.create({
            data: {
                userId,
                title: parsedData.title || 'Imported Resume',
                sectionOrder: ['personalInfo', 'professionalSummary', 'experience', 'education', 'skills', 'projects', 'custom'],
                personalInfo: parsedData.personalInfo || {},
                professionalSummary: parsedData.professionalSummary || '',
                experience: parsedData.experience || [],
                education: parsedData.education || [],
                skills: parsedData.skills || [],
            },
        });
    }
};
exports.ResumesService = ResumesService;
exports.ResumesService = ResumesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ResumesService);
//# sourceMappingURL=resumes.service.js.map