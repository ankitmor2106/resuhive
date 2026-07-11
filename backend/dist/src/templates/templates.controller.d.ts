import { TemplatesService } from './templates.service';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    findAll(): {
        id: string;
        name: string;
        description: string;
    }[];
}
