import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importResume(
    @CurrentUser() user: { userId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.resumesService.importResume(user.userId, file);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() createResumeDto: CreateResumeDto
  ) {
    return this.resumesService.create(user.userId, createResumeDto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.resumesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.resumesService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Body() updateResumeDto: UpdateResumeDto
  ) {
    return this.resumesService.update(id, user.userId, updateResumeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string }
  ) {
    return this.resumesService.remove(id, user.userId);
  }
}
