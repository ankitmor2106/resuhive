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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cerebras_provider_1 = require("./providers/cerebras.provider");
let AiService = class AiService {
    prisma;
    aiProvider;
    constructor(prisma, aiProvider) {
        this.prisma = prisma;
        this.aiProvider = aiProvider;
    }
    async requestSuggestion(resumeId, userId, type, data) {
        const resume = await this.prisma.resume.findFirst({
            where: { id: resumeId, userId, deletedAt: null },
        });
        if (!resume) {
            throw new common_1.NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
        }
        let suggestedTexts = [];
        let sectionData = data.sectionData;
        if (!sectionData && data.sectionId) {
            if (data.sectionId === 'summary') {
                sectionData = resume.professionalSummary;
            }
            else if (data.sectionId.startsWith('exp_')) {
                const index = parseInt(data.sectionId.split('_')[1], 10);
                const exp = resume.experience;
                if (exp && exp[index])
                    sectionData = exp[index];
            }
        }
        if (type === 'SUMMARY' || (type === 'REWRITE' && data.sectionId === 'summary')) {
            suggestedTexts = await this.aiProvider.generateSummary(sectionData || resume.experience);
        }
        else if (type === 'REWRITE') {
            suggestedTexts = await this.aiProvider.rewriteSection(sectionData, data.instructions);
        }
        else if (type === 'GRAMMAR') {
            suggestedTexts = [await this.aiProvider.improveGrammar(data.text)];
        }
        else if (type === 'ACHIEVEMENT') {
            suggestedTexts = await this.aiProvider.generateAchievements(data.role, data.company);
        }
        const suggestions = await Promise.all(suggestedTexts.map(async (text) => {
            return this.prisma.aISuggestion.create({
                data: {
                    resumeId,
                    type,
                    originalText: data.text ? data.text : null,
                    suggestedText: text,
                },
            });
        }));
        return suggestions.map(suggestion => ({
            id: suggestion.id,
            type: suggestion.type,
            targetSectionId: data.sectionId || '',
            original: suggestion.originalText || '',
            suggested: suggestion.suggestedText,
            status: suggestion.status.toLowerCase(),
        }));
    }
    async applySuggestion(suggestionId, userId) {
        const suggestion = await this.prisma.aISuggestion.findUnique({
            where: { id: suggestionId },
            include: { resume: true },
        });
        if (!suggestion || suggestion.resume.userId !== userId) {
            throw new common_1.NotFoundException({ code: 'AI_002', message: 'Suggestion not found' });
        }
        const updated = await this.prisma.aISuggestion.update({
            where: { id: suggestionId },
            data: { status: 'ACCEPTED' },
        });
        return {
            id: updated.id,
            type: updated.type,
            targetSectionId: '',
            original: updated.originalText || '',
            suggested: updated.suggestedText,
            status: updated.status.toLowerCase(),
        };
    }
    async rejectSuggestion(suggestionId, userId) {
        const suggestion = await this.prisma.aISuggestion.findUnique({
            where: { id: suggestionId },
            include: { resume: true },
        });
        if (!suggestion || suggestion.resume.userId !== userId) {
            throw new common_1.NotFoundException({ code: 'AI_002', message: 'Suggestion not found' });
        }
        const updated = await this.prisma.aISuggestion.update({
            where: { id: suggestionId },
            data: { status: 'REJECTED' },
        });
        return {
            id: updated.id,
            type: updated.type,
            targetSectionId: '',
            original: updated.originalText || '',
            suggested: updated.suggestedText,
            status: updated.status.toLowerCase(),
        };
    }
    async parseResumeFromText(text) {
        return this.aiProvider.parseResumeFromText(text);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cerebras_provider_1.CerebrasProvider])
], AiService);
//# sourceMappingURL=ai.service.js.map