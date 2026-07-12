import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanupAiSuggestions() {
    this.logger.log('Starting cleanup of old AI suggestions...');
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    try {
      const result = await this.prisma.aISuggestion.deleteMany({
        where: {
          createdAt: {
            lt: twentyFourHoursAgo,
          },
        },
      });
      
      this.logger.log(`Successfully deleted ${result.count} old AI suggestions`);
    } catch (error) {
      this.logger.error('Failed to clean up old AI suggestions', error);
    }
  }
}
