import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { MatchJDDto } from './dto/analysis.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('resumes/:resumeId/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('ats')
  analyzeAts(
    @Param('resumeId') resumeId: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.analysisService.analyzeResume(resumeId, user.userId);
  }

  @Post('jd-match')
  matchJd(
    @Param('resumeId') resumeId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: MatchJDDto
  ) {
    return this.analysisService.matchJobDescription(resumeId, user.userId, dto);
  }
}
