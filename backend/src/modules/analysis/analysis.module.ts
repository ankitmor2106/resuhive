import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { AnalysisProcessor } from './analysis.processor';
import { CerebrasAtsClient } from './ai/cerebras.client';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'analysis',
    }),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, AnalysisProcessor, CerebrasAtsClient],
  exports: [AnalysisService],
})
export class AnalysisModule {}
