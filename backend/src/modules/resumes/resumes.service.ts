import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
import { AiService } from '../ai/ai.service';
const pdfParse = require('pdf-parse');

@Injectable()
export class ResumesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: string, createResumeDto: CreateResumeDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const fullName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : (user.firstName || user.lastName || '');

    const dummyPersonalInfo = {
      fullName: fullName || "Diya Agarwal",
      email: user.email || "d.agarwal@example.in",
      phone: "+91 11 5555 3345",
      location: "New Delhi, India",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
    };

    const dummySummary = "Customer-focused Retail Sales professional with solid understanding of retail dynamics, marketing and customer service. Offering 5 years of experience providing quality product recommendations and solutions to meet customer needs and exceed expectations.";

    const dummyExperience = [
      {
        id: crypto.randomUUID(),
        company: "ZARA",
        role: "Retail Sales Associate",
        location: "New Delhi, India",
        startDate: "02/2017",
        endDate: "Current",
        current: true,
        bullets: [
          "Increased monthly sales 10% by effectively upselling and cross-selling products to maximize profitability.",
          "Prevented store losses by leveraging awareness, attention to detail, and integrity to identify and investigate concerns."
        ]
      }
    ];
    
    // Add user's real experience if available
    if (user.experience) {
      dummyExperience.unshift({
        id: crypto.randomUUID(),
        company: 'Previous Company',
        role: user.occupation || 'Professional',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: [user.experience],
      });
    }

    const dummySkills = [
      {
        id: crypto.randomUUID(),
        category: "Skills",
        items: (user.skills && Array.isArray(user.skills) && user.skills.length > 0) ? user.skills : ["Cash register operation", "POS system operation", "Sales expertise", "Teamwork", "Inventory management"]
      }
    ];

    const dummyEducation = [
      {
        id: crypto.randomUUID(),
        institution: "Oxford Software Institute",
        degree: "Diploma",
        field: "Financial Accounting",
        startYear: "2013",
        endYear: "2016",
        grade: ""
      }
    ];

    return this.prisma.resume.create({
      data: {
        userId,
        title: createResumeDto.title || 'Untitled Resume',
        sectionOrder: ['personalInfo', 'professionalSummary', 'experience', 'education', 'skills', 'projects', 'custom'],
        personalInfo: dummyPersonalInfo,
        professionalSummary: user.occupation ? `Professional ${user.occupation} with experience in the field.` : dummySummary,
        experience: dummyExperience,
        education: dummyEducation,
        skills: dummySkills,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!resume) {
      throw new NotFoundException({ code: 'RESUME_001', message: 'Resume not found' });
    }
    return resume;
  }

  async update(id: string, userId: string, updateResumeDto: UpdateResumeDto) {
    // Ensure resume exists and belongs to user
    await this.findOne(id, userId);

    return this.prisma.resume.update({
      where: { id },
      data: updateResumeDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.resume.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async importResume(userId: string, file: Express.Multer.File) {
    let text = '';
    
    if (file.mimetype === 'application/pdf') {
      try {
        const pdfData = await pdfParse(file.buffer);
        text = pdfData.text;
      } catch (err) {
        console.error('pdfParse error:', err);
        throw new BadRequestException('Failed to parse PDF file.');
      }
    } else {
      text = file.buffer.toString('utf-8');
    }

    if (!text || text.trim().length === 0) {
      throw new BadRequestException('No text could be extracted from the file.');
    }

    // Pass to AI for structured parsing
    const parsedData = await this.aiService.parseResumeFromText(text);

    // Create the resume in the database
    return this.prisma.resume.create({
      data: {
        userId,
        title: parsedData.title || 'Imported Resume',
        sectionOrder: ['personalInfo', 'professionalSummary', 'experience', 'education', 'skills', 'projects', 'custom'],
        personalInfo: parsedData.personalInfo || {},
        professionalSummary: parsedData.professionalSummary || '',
        experience: parsedData.experience || [],
        education: parsedData.education || [],
        skills: parsedData.skills || [],
      },
    });
  }

  async cleanupAiSuggestions(resumeId: string, userId: string) {
    // Verify it belongs to the user
    await this.findOne(resumeId, userId);
    
    const result = await this.prisma.aISuggestion.deleteMany({
      where: { resumeId }
    });
    return { success: true, deletedCount: result.count };
  }
}
