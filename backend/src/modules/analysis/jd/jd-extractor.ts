import { CerebrasAtsClient } from '../ai/cerebras.client';
import { JD_EXTRACTION_PROMPT } from '../ai/prompts/jd-extraction.prompt';
import { JDLLMOutputSchema, JDLLMOutput } from '../ai/response-validator';

export class JDExtractor {
  constructor(private readonly client: CerebrasAtsClient) {}

  async extract(resume: any, jdText: string, model: string = 'gpt-oss-120b'): Promise<JDLLMOutput> {
    const userContent = `Resume:
${JSON.stringify(resume)}

Job Description:
${jdText}`;

    return this.client.callStructured<JDLLMOutput>({
      systemPrompt: JD_EXTRACTION_PROMPT,
      userContent,
      schema: {
        type: 'object',
        properties: {
          seniority: { type: 'string' },
          industry: { type: 'string' },
          requirements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                requirement: { type: 'string' },
                category: { type: 'string', enum: ['technical', 'soft_skill', 'experience', 'education', 'certification', 'tool', 'responsibility'] },
                priority: { type: 'string', enum: ['required', 'preferred'] },
                status: { type: 'string', enum: ['matched', 'partial', 'missing'] },
                note: { type: 'string' },
              },
              required: ['requirement', 'category', 'priority', 'status', 'note'],
              additionalProperties: false,
            },
          },
          gaps: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
        },
        required: ['seniority', 'industry', 'requirements', 'gaps', 'improvements'],
        additionalProperties: false,
      },
      schemaName: 'jd_extraction',
      zodSchema: JDLLMOutputSchema,
      model,
    });
  }
}
