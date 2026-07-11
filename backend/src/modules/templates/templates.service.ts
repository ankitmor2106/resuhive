import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  findAll() {
    return [
      { id: 'classic', name: 'Classic Professional', description: 'A clean, traditional resume template.' },
      { id: 'modern', name: 'Modern Minimalist', description: 'A sleek, modern design.' },
      { id: 'creative', name: 'Creative Portfolio', description: 'A template designed for creative professionals.' }
    ];
  }
}
