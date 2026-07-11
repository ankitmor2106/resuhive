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
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalysisService = class AnalysisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async analyzeResume(resumeId, userId) {
        const resume = await this.prisma.resume.findFirst({
            where: { id: resumeId, userId, deletedAt: null },
        });
        if (!resume) {
            throw new common_1.NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
        }
        const { score, categories, recommendations } = this.calculateAtsScore(resume);
        await this.prisma.aTSAnalysis.create({
            data: {
                resumeId,
                totalScore: score,
                breakdown: categories,
                issueCount: categories.reduce((acc, c) => acc + c.issues.length, 0),
            },
        });
        return {
            resumeId,
            overallScore: score,
            categories,
            recommendations,
            createdAt: new Date().toISOString(),
        };
    }
    async matchJobDescription(resumeId, userId, dto) {
        const resume = await this.prisma.resume.findFirst({
            where: { id: resumeId, userId, deletedAt: null },
        });
        if (!resume) {
            throw new common_1.NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
        }
        const result = this.calculateJdMatch(resume, dto.jobDescription);
        await this.prisma.jDMatch.create({
            data: {
                resumeId,
                jobDescription: dto.jobDescription,
                matchPercentage: result.matchPercentage,
                missingSkills: result.missingSkills,
                gaps: result.experienceGaps,
                improvements: result.suggestedImprovements,
            },
        });
        return {
            resumeId,
            matchPercentage: result.matchPercentage,
            matchingSkills: result.matchingSkills,
            missingSkills: result.missingSkills,
            missingKeywords: result.missingKeywords,
            experienceGaps: result.experienceGaps,
            suggestedImprovements: result.suggestedImprovements,
        };
    }
    calculateAtsScore(resume) {
        const categories = [];
        const recommendations = [];
        const contactIssues = [];
        let contactScore = 0;
        if (resume.personalInfo) {
            const pi = resume.personalInfo;
            if (pi.email)
                contactScore += 3;
            else
                contactIssues.push('Missing email address');
            if (pi.phone)
                contactScore += 3;
            else
                contactIssues.push('Missing phone number');
            if (pi.fullName)
                contactScore += 2;
            else
                contactIssues.push('Missing full name');
            if (pi.location)
                contactScore += 1;
            else
                contactIssues.push('Missing location');
            if (pi.linkedin)
                contactScore += 1;
            else
                contactIssues.push('Consider adding a LinkedIn profile');
        }
        else {
            contactIssues.push('No contact information provided');
        }
        categories.push({ name: 'Contact Information', weight: 10, score: contactScore * 10, issues: contactIssues });
        if (contactIssues.length > 0)
            recommendations.push('Complete all contact information fields for better ATS parsing.');
        const summaryIssues = [];
        let summaryScore = 0;
        if (resume.professionalSummary && typeof resume.professionalSummary === 'string' && resume.professionalSummary.trim().length > 0) {
            summaryScore = 100;
            const words = resume.professionalSummary.trim().split(/\s+/).length;
            if (words < 30) {
                summaryScore = 60;
                summaryIssues.push('Summary is too short — aim for 3-5 sentences');
            }
            if (words > 100) {
                summaryScore = 70;
                summaryIssues.push('Summary is too long — keep it concise');
            }
        }
        else {
            summaryIssues.push('No professional summary provided');
            recommendations.push('Add a professional summary to introduce your key qualifications.');
        }
        categories.push({ name: 'Professional Summary', weight: 15, score: summaryScore, issues: summaryIssues });
        const expIssues = [];
        let expScore = 0;
        const exp = resume.experience;
        if (exp && Array.isArray(exp) && exp.length > 0) {
            expScore = 60;
            if (exp.length >= 2)
                expScore += 20;
            const hasBullets = exp.every((e) => e.bullets && e.bullets.length > 0);
            if (hasBullets)
                expScore += 20;
            else
                expIssues.push('Some experience entries are missing bullet points');
            const hasQuantified = exp.some((e) => e.bullets && e.bullets.some((b) => /\d+/.test(b)));
            if (!hasQuantified)
                expIssues.push('Add quantified achievements (numbers, percentages) to bullet points');
        }
        else {
            expIssues.push('No work experience listed');
            recommendations.push('Add your work experience with detailed bullet points highlighting achievements.');
        }
        categories.push({ name: 'Work Experience', weight: 25, score: Math.min(expScore, 100), issues: expIssues });
        const eduIssues = [];
        let eduScore = 0;
        const edu = resume.education;
        if (edu && Array.isArray(edu) && edu.length > 0) {
            eduScore = 100;
        }
        else {
            eduIssues.push('No education information provided');
            recommendations.push('Add your educational background.');
        }
        categories.push({ name: 'Education', weight: 10, score: eduScore, issues: eduIssues });
        const skillIssues = [];
        let skillScore = 0;
        const skills = resume.skills;
        if (skills && Array.isArray(skills) && skills.length > 0) {
            skillScore = 70;
            const totalItems = skills.reduce((acc, s) => acc + (s.items ? s.items.length : 0), 0);
            if (totalItems >= 5)
                skillScore += 15;
            if (totalItems >= 10)
                skillScore += 15;
            if (totalItems < 3)
                skillIssues.push('Add more skills to improve keyword matching');
        }
        else {
            skillIssues.push('No skills section found');
            recommendations.push('Add a skills section with relevant technical and soft skills.');
        }
        categories.push({ name: 'Skills & Keywords', weight: 20, score: Math.min(skillScore, 100), issues: skillIssues });
        const fmtIssues = [];
        let fmtScore = 80;
        if (!resume.sectionOrder || resume.sectionOrder.length < 3) {
            fmtScore = 50;
            fmtIssues.push('Resume lacks clear section organization');
        }
        categories.push({ name: 'Formatting & Structure', weight: 10, score: fmtScore, issues: fmtIssues });
        categories.push({ name: 'Impact & Readability', weight: 10, score: 75, issues: [] });
        const totalWeight = categories.reduce((acc, c) => acc + c.weight, 0);
        const score = Math.round(categories.reduce((acc, c) => acc + (c.score * c.weight / 100), 0) * 100 / totalWeight);
        if (recommendations.length === 0) {
            recommendations.push('Your resume looks solid! Consider tailoring it to specific job descriptions.');
        }
        return { score, categories, recommendations };
    }
    calculateJdMatch(resume, jd) {
        const jdLower = jd.toLowerCase();
        const resumeStr = JSON.stringify(resume).toLowerCase();
        const allKeywords = [
            'react', 'node', 'nodejs', 'typescript', 'javascript', 'python', 'java', 'aws', 'docker',
            'kubernetes', 'sql', 'nosql', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'api',
            'git', 'ci/cd', 'agile', 'scrum', 'jira', 'figma', 'css', 'html', 'angular', 'vue',
            'next.js', 'express', 'django', 'flask', 'spring', 'microservices', 'cloud', 'azure',
            'gcp', 'terraform', 'linux', 'machine learning', 'data analysis', 'testing', 'jest',
            'cypress', 'leadership', 'communication', 'project management',
        ];
        const jdKeywords = allKeywords.filter(kw => jdLower.includes(kw));
        const matchingSkills = [];
        const missingSkills = [];
        const missingKeywords = [];
        const resumeSkillWords = [];
        if (resume.skills && Array.isArray(resume.skills)) {
            for (const group of resume.skills) {
                if (group.items && Array.isArray(group.items)) {
                    resumeSkillWords.push(...group.items.map((s) => s.toLowerCase()));
                }
            }
        }
        jdKeywords.forEach(kw => {
            if (resumeStr.includes(kw) || resumeSkillWords.some(s => s.includes(kw))) {
                matchingSkills.push(kw);
            }
            else {
                missingSkills.push(kw);
            }
        });
        const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'from', 'this', 'that', 'with', 'they', 'been', 'will', 'their', 'would', 'about', 'which', 'when', 'make', 'like', 'time', 'just', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'than', 'other', 'look', 'only', 'come', 'over', 'such', 'also', 'back', 'work', 'first', 'well', 'must', 'where', 'what', 'were', 'being', 'should', 'need', 'role', 'team', 'join', 'looking', 'ideal', 'candidate', 'experience', 'strong', 'ability']);
        const jdWords = jdLower.match(/\b[a-z]{3,}\b/g) || [];
        const uniqueJdWords = [...new Set(jdWords)].filter(w => !stopWords.has(w));
        for (const word of uniqueJdWords.slice(0, 20)) {
            if (!resumeStr.includes(word) && !missingKeywords.includes(word) && !missingSkills.includes(word)) {
                missingKeywords.push(word);
            }
        }
        missingKeywords.splice(10);
        const totalKeywords = jdKeywords.length || 1;
        const matchPercentage = Math.round((matchingSkills.length / totalKeywords) * 100);
        const experienceGaps = [];
        if (!resume.experience || resume.experience.length === 0) {
            experienceGaps.push('No work experience listed — add relevant professional experience');
        }
        if (missingSkills.length > 3) {
            experienceGaps.push(`Missing ${missingSkills.length} key skills mentioned in the job description`);
        }
        const suggestedImprovements = [];
        if (missingSkills.length > 0) {
            suggestedImprovements.push(`Add these missing skills if applicable: ${missingSkills.slice(0, 5).join(', ')}`);
        }
        if (!resume.professionalSummary) {
            suggestedImprovements.push('Add a professional summary tailored to this job description');
        }
        suggestedImprovements.push('Use keywords from the job description in your experience bullet points');
        suggestedImprovements.push('Quantify your achievements with numbers and metrics where possible');
        return {
            matchPercentage: Math.max(matchPercentage, 10),
            matchingSkills,
            missingSkills,
            missingKeywords,
            experienceGaps,
            suggestedImprovements,
        };
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map