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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ExportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const puppeteer_1 = __importDefault(require("puppeteer"));
let ExportsService = ExportsService_1 = class ExportsService {
    prisma;
    storageService;
    logger = new common_1.Logger(ExportsService_1.name);
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async generatePdf(resumeId, userId) {
        const resume = await this.prisma.resume.findFirst({
            where: { id: resumeId, userId, deletedAt: null },
        });
        if (!resume) {
            throw new common_1.NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
        }
        const exportRecord = await this.prisma.export.create({
            data: {
                resumeId,
                status: 'PENDING',
            },
        });
        try {
            await this.prisma.export.update({
                where: { id: exportRecord.id },
                data: { status: 'GENERATING' },
            });
            const browser = await puppeteer_1.default.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });
            const page = await browser.newPage();
            const personalInfo = resume.personalInfo || {};
            const experience = resume.experience || [];
            const education = resume.education || [];
            const skills = resume.skills || [];
            const summary = resume.professionalSummary || '';
            const expHtml = experience.map(exp => `
        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0;">${exp.title || 'Role'} at ${exp.company || 'Company'}</h3>
          <p style="margin: 5px 0; color: #555; font-size: 14px;">${exp.startDate || ''} - ${exp.endDate || ''} | ${exp.location || ''}</p>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${(exp.bullets || []).map((b) => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('');
            const eduHtml = education.map(edu => `
        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0;">${edu.degree || 'Degree'}</h3>
          <p style="margin: 5px 0; color: #555; font-size: 14px;">${edu.school || 'School'} | ${edu.graduationDate || ''}</p>
        </div>
      `).join('');
            const skillHtml = skills.map(group => `
        <div style="margin-bottom: 10px;">
          <strong>${group.name || 'Category'}:</strong> ${(group.items || []).join(', ')}
        </div>
      `).join('');
            const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 32px;">${personalInfo.fullName || resume.title || 'Resume'}</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                ${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
              </p>
              ${personalInfo.linkedin ? `<p style="margin: 5px 0 0 0; font-size: 14px;">${personalInfo.linkedin}</p>` : ''}
            </div>

            ${summary ? `
              <div style="margin-bottom: 20px;">
                <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Professional Summary</h2>
                <p style="font-size: 14px;">${summary}</p>
              </div>
            ` : ''}

            ${experience.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Experience</h2>
                ${expHtml}
              </div>
            ` : ''}

            ${education.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Education</h2>
                ${eduHtml}
              </div>
            ` : ''}

            ${skills.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Skills</h2>
                ${skillHtml}
              </div>
            ` : ''}
          </body>
        </html>
      `;
            await page.setContent(htmlContent);
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            await browser.close();
            const fs = require('fs');
            const path = require('path');
            const exportsDir = path.join(process.cwd(), 'exports-temp');
            if (!fs.existsSync(exportsDir)) {
                fs.mkdirSync(exportsDir, { recursive: true });
            }
            const filePath = path.join(exportsDir, `${exportRecord.id}.pdf`);
            fs.writeFileSync(filePath, pdfBuffer);
            let downloadUrl = `http://localhost:3001/api/v1/resumes/${resumeId}/export/${exportRecord.id}/download`;
            if (this.storageService.isReady()) {
                try {
                    const key = `resumes/${resumeId}/exports/${exportRecord.id}.pdf`;
                    const s3Url = await this.storageService.uploadPdf(key, Buffer.from(pdfBuffer));
                    downloadUrl = s3Url;
                    this.logger.log(`Successfully uploaded PDF to S3: ${key}`);
                }
                catch (s3Error) {
                    this.logger.error('S3 upload failed, falling back to local storage URL', s3Error);
                }
            }
            return await this.prisma.export.update({
                where: { id: exportRecord.id },
                data: {
                    status: 'READY',
                    fileUrl: downloadUrl,
                },
            });
        }
        catch (e) {
            await this.prisma.export.update({
                where: { id: exportRecord.id },
                data: { status: 'FAILED' },
            });
            throw new common_1.InternalServerErrorException({ code: 'EXPORT_001', message: 'Generation failed' });
        }
    }
    async getExportStatus(exportId, userId) {
        const exportRecord = await this.prisma.export.findUnique({
            where: { id: exportId },
            include: { resume: true },
        });
        if (!exportRecord || exportRecord.resume.userId !== userId) {
            throw new common_1.NotFoundException({ code: 'EXPORT_002', message: 'Export not found' });
        }
        return exportRecord;
    }
};
exports.ExportsService = ExportsService;
exports.ExportsService = ExportsService = ExportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ExportsService);
//# sourceMappingURL=exports.service.js.map