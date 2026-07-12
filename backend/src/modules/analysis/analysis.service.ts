import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { MatchJDDto } from './dto/analysis.dto';

@Injectable()
export class AnalysisService {
  private queueEvents: QueueEvents;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('analysis') private readonly analysisQueue: Queue
  ) {
    this.queueEvents = new QueueEvents('analysis', {
      connection: this.analysisQueue.opts.connection,
    });
  }

  async analyzeResume(resumeId: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      throw new NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
    }

    const job = await this.analysisQueue.add('ats', { resumeId, userId });
    
    // We wait for the job to finish to maintain the legacy API contract synchronously
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async matchJobDescription(resumeId: string, userId: string, dto: MatchJDDto) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      throw new NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
    }

    const job = await this.analysisQueue.add('jd-match', { 
      resumeId, 
      userId, 
      jdText: dto.jobDescription 
    });

    // Wait for the job to finish to maintain the legacy API contract synchronously
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
