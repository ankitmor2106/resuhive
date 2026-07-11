import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';
export declare class ContactService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(createContactDto: CreateContactDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        message: string;
        topic: string;
    }>;
}
