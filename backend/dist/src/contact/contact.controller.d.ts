import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        message: string;
        topic: string;
    }>;
}
