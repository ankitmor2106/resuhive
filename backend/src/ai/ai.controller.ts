import { Controller, Post, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('resumes/:resumeId/suggestions')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  requestSuggestion(
    @Param('resumeId') resumeId: string,
    @CurrentUser() user: { userId: string },
    @Body() body: any
  ) {
    return this.aiService.requestSuggestion(resumeId, user.userId, body.type, body.data);
  }

  @Patch(':id/accept')
  applySuggestion(
    @Param('id') suggestionId: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.aiService.applySuggestion(suggestionId, user.userId);
  }

  @Patch(':id/reject')
  rejectSuggestion(
    @Param('id') suggestionId: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.aiService.rejectSuggestion(suggestionId, user.userId);
  }
}
