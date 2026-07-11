import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CerebrasProvider } from './providers/cerebras.provider';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiProvider: CerebrasProvider,
  ) {}

  async requestSuggestion(resumeId: string, userId: string, type: any, data: any) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      throw new NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
    }

    let suggestedTexts: string[] = [];

    let sectionData = data.sectionData;
    if (!sectionData && data.sectionId) {
      if (data.sectionId === 'summary') {
        sectionData = resume.professionalSummary;
      } else if (data.sectionId.startsWith('exp_')) {
        const index = parseInt(data.sectionId.split('_')[1], 10);
        const exp = resume.experience as any[];
        if (exp && exp[index]) sectionData = exp[index];
      }
    }

    // Async suggestion flow
    if (type === 'SUMMARY' || (type === 'REWRITE' && data.sectionId === 'summary')) {
      suggestedTexts = await this.aiProvider.generateSummary(sectionData || resume.experience);
    } else if (type === 'REWRITE') {
      suggestedTexts = await this.aiProvider.rewriteSection(sectionData, data.instructions);
    } else if (type === 'GRAMMAR') {
      suggestedTexts = [await this.aiProvider.improveGrammar(data.text)];
    } else if (type === 'ACHIEVEMENT') {
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

  async applySuggestion(suggestionId: string, userId: string) {
    const suggestion = await this.prisma.aISuggestion.findUnique({
      where: { id: suggestionId },
      include: { resume: true },
    });

    if (!suggestion || suggestion.resume.userId !== userId) {
      throw new NotFoundException({ code: 'AI_002', message: 'Suggestion not found' });
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

  async rejectSuggestion(suggestionId: string, userId: string) {
    const suggestion = await this.prisma.aISuggestion.findUnique({
      where: { id: suggestionId },
      include: { resume: true },
    });

    if (!suggestion || suggestion.resume.userId !== userId) {
      throw new NotFoundException({ code: 'AI_002', message: 'Suggestion not found' });
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

  async parseResumeFromText(text: string) {
    return this.aiProvider.parseResumeFromText(text);
  }
}
