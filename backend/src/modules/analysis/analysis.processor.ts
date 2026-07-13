import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CerebrasAtsClient } from './ai/cerebras.client';
import { scoreContactInformation } from './ats/analyzers/contact.analyzer';
import { scoreEducation } from './ats/analyzers/education.analyzer';
import { normalizeSkills } from './ats/analyzers/skills.normalizer';
import { combineATSScore } from './ats/scoring/score-engine';
import { rankByImpact } from './ats/scoring/recommendation-ranker';
import { JDExtractor } from './jd/jd-extractor';
import { computeMatchByCategory, mergeGaps } from './jd/match-engine';
import { toLegacyShape } from './jd/legacy-shape.adapter';
import { ATS_SYSTEM_PROMPT } from './ai/prompts/ats-assessment.prompt';
import { ATSLLMOutputSchema, ATSLLMOutput } from './ai/response-validator';

@Processor('analysis')
@Injectable()
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);
  private jdExtractor: JDExtractor;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cerebrasClient: CerebrasAtsClient
  ) {
    super();
    this.jdExtractor = new JDExtractor(this.cerebrasClient);
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'ats':
        return this.processAts(job.data);
      case 'jd-match':
        return this.processJdMatch(job.data);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  async processAts(data: { resumeId: string, userId: string }): Promise<any> {
    const { resumeId, userId } = data;
    
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const cleanedResume = { ...resume } as any;
    if (cleanedResume.skills) {
      // Normalize skills before sending to Cerebras
      const rawSkills = Array.isArray(cleanedResume.skills) 
        ? cleanedResume.skills.flatMap((g: any) => g.items || []) 
        : [];
      cleanedResume.skills = normalizeSkills(rawSkills);
    }

    const llmOutput = await this.cerebrasClient.callStructured<ATSLLMOutput>({
      systemPrompt: ATS_SYSTEM_PROMPT,
      userContent: `Evaluate this resume:\n\n${JSON.stringify(cleanedResume)}`,
      schema: {
        type: 'object',
        properties: {
          professionalSummary: { $ref: '#/$defs/CategoryAssessment' },
          workExperience: { $ref: '#/$defs/CategoryAssessment' },
          skillsKeywords: { $ref: '#/$defs/CategoryAssessment' },
          formattingStructure: { $ref: '#/$defs/CategoryAssessment' },
          impactReadability: { $ref: '#/$defs/CategoryAssessment' },
          projects: { $ref: '#/$defs/CategoryAssessment' },
          recruiterSnapshot: {
            type: 'object',
            properties: {
              firstImpression: { type: 'string' },
              strengths: { type: 'array', items: { type: 'string' } },
              watchOuts: { type: 'array', items: { type: 'string' } },
            },
            required: ['firstImpression', 'strengths', 'watchOuts'],
            additionalProperties: false,
          }
        },
        required: [
          'professionalSummary', 'workExperience', 'skillsKeywords', 
          'formattingStructure', 'impactReadability', 'recruiterSnapshot'
        ],
        additionalProperties: false,
        $defs: {
          CategoryAssessment: {
            type: 'object',
            properties: {
              score: { type: 'number', minimum: 0, maximum: 100 },
              summary: { type: 'string' },
              issues: { type: 'array', items: { type: 'string' } },
              suggestions: { type: 'array', items: { type: 'string' } }
            },
            required: ['score', 'summary', 'issues', 'suggestions'],
            additionalProperties: false
          }
        }
      },
      schemaName: 'ats_assessment',
      zodSchema: ATSLLMOutputSchema,
      model: 'gpt-oss-120b',
    });

    const contactScore = scoreContactInformation(resume);
    const eduScore = scoreEducation(resume);

    const result = combineATSScore(llmOutput, contactScore, eduScore);
    const categoryWeights = {
      professionalSummary: 1.5,
      workExperience: 2.0,
      skillsKeywords: 1.5,
      formattingStructure: 1.0,
      impactReadability: 1.0,
      projects: 1.2
    };
    const rankedCategories = rankByImpact(result.categories, categoryWeights);

    // Save to DB
    await this.prisma.aTSAnalysis.create({
      data: {
        resumeId,
        totalScore: result.totalScore,
        breakdown: result.categories as any,
        issueCount: Object.values(result.categories).reduce((acc: number, c: any) => acc + (c.issues?.length || 0), 0),
      },
    });

    const categoriesArray = Object.entries(result.categories).map(([name, data]) => ({ name, ...data as any }));
    
    return {
      resumeId,
      overallScore: result.totalScore, // Legacy shape
      categories: categoriesArray,
      recommendations: [], // Keep empty or populate from ranked
      createdAt: new Date().toISOString(),
    };
  }

  async processJdMatch(data: { resumeId: string, userId: string, jdText: string }): Promise<any> {
    const { resumeId, userId, jdText } = data;

    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const llmOutput = await this.jdExtractor.extract(resume, jdText);
    const legacyShape = toLegacyShape(llmOutput.requirements);
    const matchByCategory = computeMatchByCategory(llmOutput.requirements);
    
    // Overall match percentage (average of categories or overall computation)
    // For legacy, we might just compute an average or use total requirements
    const totalMatchPercentage = Math.round(
      llmOutput.requirements.reduce((acc, r) => acc + (r.status === 'matched' ? 1 : r.status === 'partial' ? 0.5 : 0), 0) / 
      (llmOutput.requirements.length || 1) * 100
    );

    const gaps = mergeGaps(llmOutput.gaps, resume);

    await this.prisma.jDMatch.create({
      data: {
        resumeId,
        jobDescription: jdText,
        matchPercentage: totalMatchPercentage,
        missingSkills: legacyShape.missingSkills,
        gaps: gaps,
        improvements: llmOutput.improvements,
      },
    });

    return {
      resumeId,
      matchPercentage: totalMatchPercentage,
      matchingSkills: legacyShape.matchingSkills,
      missingSkills: legacyShape.missingSkills,
      missingKeywords: [], // deprecated, return empty
      experienceGaps: gaps,
      suggestedImprovements: llmOutput.improvements,
    };
  }
}
