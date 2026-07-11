import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  describe('calculateAtsScore (Pure)', () => {
    it('should calculate perfect score if all sections are present', () => {
      const mockResume = {
        personalInfo: { email: 'test@test.com', phone: '123' },
        experience: { items: [] },
        education: { items: [] },
        skills: { items: [] },
      };

      const result = (service as any).calculateAtsScore(mockResume);
      
      // Contact(10) + Structure(15) + Skills(15) + Exp(25) + Edu(10) + Key(15) + Read(10) = 100
      expect(result.score).toBe(100);
      expect(result.issues).toBe(0);
      expect(result.breakdown.experience).toBe(25);
    });

    it('should penalize missing contact info', () => {
      const mockResume = {
        experience: { items: [] },
        education: { items: [] },
        skills: { items: [] },
      };

      const result = (service as any).calculateAtsScore(mockResume);
      expect(result.score).toBe(90); // 100 - 10
      expect(result.issues).toBe(1);
    });
  });

  describe('calculateJdMatch (Pure)', () => {
    it('should find exact matches and missing skills', () => {
      const mockResume = {
        skills: { items: ['react', 'node'] }
      };
      
      const jd = "We are looking for a developer with React, Node, and AWS experience.";
      const result = (service as any).calculateJdMatch(mockResume, jd);
      
      // 'react', 'node', 'aws' are the matching words out of the hardcoded techWords
      expect(result.missingSkills).toContain('aws');
      expect(result.matchPercentage).toBe(67); // 2 out of 3 = 67%
    });
  });
});
