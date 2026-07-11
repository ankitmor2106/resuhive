import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async create(data: {
    email: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    occupation?: string;
    experience?: string;
    skills?: string[];
    authProvider?: 'EMAIL' | 'GOOGLE';
    googleId?: string;
    profileCompleted?: boolean;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    occupation?: string;
    experience?: string;
    skills?: string[];
    passwordHash?: string;
    googleId?: string;
    profileCompleted?: boolean;
  }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
