import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import puppeteer from 'puppeteer';

@Injectable()
export class ExportsService {
  private readonly logger = new Logger(ExportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService
  ) {}


  async generatePdf(resumeId: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      throw new NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
    }

    // In a real application, we would generate a unique export record here
    // And use a proper template engine (like Handlebars or EJS) to generate HTML
    // For this implementation, we will mock the PDF generation for the assignment
    const exportRecord = await this.prisma.export.create({
      data: {
        resumeId,
        status: 'PENDING',
      },
    });

    try {
      // We update to generating
      await this.prisma.export.update({
        where: { id: exportRecord.id },
        data: { status: 'GENERATING' },
      });

      // Simple mocked PDF generation
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      
      const personalInfo = resume.personalInfo as any || {};
      const experience = resume.experience as any[] || [];
      const education = resume.education as any[] || [];
      const skills = resume.skills as any[] || [];
      const summary = resume.professionalSummary as string || '';

      const expHtml = experience.map(exp => `
        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0;">${exp.title || 'Role'} at ${exp.company || 'Company'}</h3>
          <p style="margin: 5px 0; color: #555; font-size: 14px;">${exp.startDate || ''} - ${exp.endDate || ''} | ${exp.location || ''}</p>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}
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

      // Ensure directory exists
      const fs = require('fs');
      const path = require('path');
      const exportsDir = path.join(process.cwd(), 'exports-temp');
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      // Save file locally
      const filePath = path.join(exportsDir, `${exportRecord.id}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      // Return a URL pointing to our backend controller (local fallback)
      let downloadUrl = `http://localhost:3001/api/v1/resumes/${resumeId}/export/${exportRecord.id}/download`;

      // Dual-save: Upload to S3 if configured
      if (this.storageService.isReady()) {
        try {
          const key = `resumes/${resumeId}/exports/${exportRecord.id}.pdf`;
          const s3Url = await this.storageService.uploadPdf(key, Buffer.from(pdfBuffer));
          downloadUrl = s3Url; // prefer S3 URL if successful
          this.logger.log(`Successfully uploaded PDF to S3: ${key}`);
        } catch (s3Error) {
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
    } catch (e) {
      await this.prisma.export.update({
        where: { id: exportRecord.id },
        data: { status: 'FAILED' },
      });
      throw new InternalServerErrorException({ code: 'EXPORT_001', message: 'Generation failed' });
    }
  }

  async getExportStatus(exportId: string, userId: string) {
    const exportRecord = await this.prisma.export.findUnique({
      where: { id: exportId },
      include: { resume: true },
    });

    if (!exportRecord || exportRecord.resume.userId !== userId) {
      throw new NotFoundException({ code: 'EXPORT_002', message: 'Export not found' });
    }

    return exportRecord;
  }
}
