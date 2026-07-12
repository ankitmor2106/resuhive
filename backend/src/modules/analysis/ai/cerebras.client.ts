import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { z } from 'zod';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class AtsAssessmentError extends Error {}

export interface StructuredCallOptions<T> {
  systemPrompt: string;
  userContent: string;
  schema: object; // JSON schema — additionalProperties:false already applied recursively
  schemaName: string;
  zodSchema: z.ZodType<T>;
  model: string;
  temperature?: number;
  seed?: number;
  maxRetries?: number;
}

@Injectable()
export class CerebrasAtsClient {
  private readonly client: Cerebras;
  private readonly logger = new Logger(CerebrasAtsClient.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('CEREBRAS_API_KEY');
    this.client = new Cerebras({ apiKey });
  }

  async callStructured<T>(opts: StructuredCallOptions<T>): Promise<T> {
    const { 
      systemPrompt, 
      userContent, 
      schema, 
      schemaName, 
      zodSchema, 
      model, 
      temperature = 0.1, 
      seed = 42, 
      maxRetries = 2 
    } = opts;
    
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          temperature,
          seed,
          response_format: { type: 'json_schema', json_schema: { name: schemaName, strict: true, schema } },
        });
        const raw = (response as any).choices[0].message.content ?? '';
        return zodSchema.parse(JSON.parse(raw));
      } catch (err: any) {
        lastError = err;
        this.logger.warn(`Cerebras call failed attempt ${attempt + 1}: ${err.message}`);
        if (err.status === 429) {
          // Exponential backoff for rate limits
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new AtsAssessmentError(`Cerebras call failed validation after ${maxRetries + 1} attempts: ${lastError}`);
  }
}
