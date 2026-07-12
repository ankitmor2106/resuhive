import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string | null, createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.userFeedback.create({
      data: {
        userId,
        rating: createFeedbackDto.rating,
        feedback: createFeedbackDto.feedback,
      },
    });
  }

  async getStats() {
    return this.prisma.platformStats.findUnique({
      where: { id: 'global' },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateRatings() {
    this.logger.log('Starting daily rating aggregation...');
    try {
      const result = await this.prisma.userFeedback.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        }
      });

      const averageRating = result._avg.rating || 0;
      const totalRatings = result._count.id;

      await this.prisma.platformStats.upsert({
        where: { id: 'global' },
        update: {
          averageRating,
          totalRatings,
        },
        create: {
          id: 'global',
          averageRating,
          totalRatings,
        },
      });

      this.logger.log(`Successfully updated global stats: avg=${averageRating.toFixed(2)}, total=${totalRatings}`);
    } catch (error) {
      this.logger.error('Failed to aggregate ratings', error);
    }
  }
}
