import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { CerebrasProvider } from './providers/cerebras.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    CerebrasProvider
  ],
  exports: [AiService],
})
export class AiModule {}
