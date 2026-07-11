import { Controller, Post, Get, Param, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportsService } from './exports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('resumes/:resumeId/export')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  exportPdf(
    @Param('resumeId') resumeId: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.exportsService.generatePdf(resumeId, user.userId);
  }

  @Get(':exportId')
  getExportStatus(
    @Param('exportId') exportId: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.exportsService.getExportStatus(exportId, user.userId);
  }

  @Get(':exportId/download')
  async downloadExport(
    @Param('exportId') exportId: string,
    @CurrentUser() user: { userId: string },
    @Res() res: Response
  ) {
    // Verify it exists and belongs to user
    await this.exportsService.getExportStatus(exportId, user.userId);
    
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'exports-temp', `${exportId}.pdf`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=resume-${exportId}.pdf`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
