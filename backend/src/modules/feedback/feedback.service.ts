import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
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
}
