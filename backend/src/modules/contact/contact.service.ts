import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({
      data: createContactDto,
    });

    // Send email notification in the background
    this.mailService.sendContactNotificationEmail(createContactDto).catch(e => {
      console.error('Failed to send contact notification email:', e);
    });

    return message;
  }
}
