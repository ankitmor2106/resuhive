import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto, ResetPasswordDto, UpdateProfileDto, UpdatePasswordDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_001', message: 'User not found' });
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, hasPassword: !!passwordHash };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException({ code: 'AUTH_003', message: 'Email already in use' });
    }

    const passwordHash = await argon2.hash(registerDto.password);

    const hasProfileData = !!(registerDto.occupation || registerDto.experience || registerDto.skills?.length);

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      dateOfBirth: registerDto.dateOfBirth ? new Date(registerDto.dateOfBirth) : undefined,
      occupation: registerDto.occupation,
      experience: registerDto.experience,
      skills: registerDto.skills,
      authProvider: 'EMAIL',
      profileCompleted: hasProfileData,
    });

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_001', message: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException({
        code: 'AUTH_004',
        message: 'This account uses Google sign-in. Please log in with Google.',
      });
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({ code: 'AUTH_001', message: 'Invalid credentials' });
    }

    return this.generateTokens(user);
  }

  async googleLogin(googleProfile: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
  }) {
    let user = await this.usersService.findByGoogleId(googleProfile.googleId);

    if (!user) {
      // Check if user exists with same email (registered via email before)
      user = await this.usersService.findByEmail(googleProfile.email);

      if (user) {
        // Link Google account to existing user
        user = await this.usersService.update(user.id, {
          googleId: googleProfile.googleId,
          ...(googleProfile.dateOfBirth && !user.dateOfBirth ? { dateOfBirth: googleProfile.dateOfBirth } : {}),
        });
      } else {
        // Create new user
        user = await this.usersService.create({
          email: googleProfile.email,
          firstName: googleProfile.firstName,
          lastName: googleProfile.lastName,
          googleId: googleProfile.googleId,
          dateOfBirth: googleProfile.dateOfBirth,
          authProvider: 'GOOGLE',
          profileCompleted: false,
        });
      }
    } else if (googleProfile.dateOfBirth && !user.dateOfBirth) {
       // Update existing Google user with birthday if it was missing
       user = await this.usersService.update(user.id, {
         dateOfBirth: googleProfile.dateOfBirth,
       });
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload);

    // Use JWT service with a different secret/expiry for refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token in DB
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Remove passwordHash from user object before returning
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokenInDb = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
        throw new UnauthorizedException({ code: 'AUTH_002', message: 'Expired token' });
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException({ code: 'AUTH_001', message: 'Invalid token user' });
      }

      // Delete old refresh token
      await this.prisma.refreshToken.delete({
        where: { id: tokenInDb.id },
      });

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException({ code: 'AUTH_002', message: 'Expired or invalid token' });
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { success: true };
    }

    if (user.authProvider === 'GOOGLE' && !user.passwordHash) {
      // Google-only users can't reset password — but don't reveal this
      return { success: true };
    }

    // Delete any existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Store hashed token with 1 hour expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    // Build reset URL
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    // Send email
    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);

    return { success: true };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    // Hash the incoming token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken) {
      throw new BadRequestException({
        code: 'AUTH_005',
        message: 'Invalid or expired reset link. Please request a new one.',
      });
    }

    if (resetToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      throw new BadRequestException({
        code: 'AUTH_005',
        message: 'Reset link has expired. Please request a new one.',
      });
    }

    // Update user's password
    const passwordHash = await argon2.hash(password);
    await this.usersService.update(resetToken.userId, { passwordHash });

    // Delete the used token
    await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    this.logger.log(`Password reset successful for user ${resetToken.userId}`);

    return { success: true };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const updateData: any = {};

    if (updateProfileDto.firstName !== undefined) updateData.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName !== undefined) updateData.lastName = updateProfileDto.lastName;
    if (updateProfileDto.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    if (updateProfileDto.occupation !== undefined) updateData.occupation = updateProfileDto.occupation;
    if (updateProfileDto.experience !== undefined) updateData.experience = updateProfileDto.experience;
    if (updateProfileDto.skills !== undefined) updateData.skills = updateProfileDto.skills;

    // Mark profile as completed if professional fields are provided
    if (updateProfileDto.occupation || updateProfileDto.experience || updateProfileDto.skills?.length) {
      updateData.profileCompleted = true;
    }

    const user = await this.usersService.update(userId, updateData);
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
    return { success: true };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_001', message: 'User not found' });
    }

    if (user.passwordHash) {
      if (!updatePasswordDto.currentPassword) {
        throw new BadRequestException({ code: 'AUTH_010', message: 'Current password is required to change password' });
      }
      const isPasswordValid = await argon2.verify(user.passwordHash, updatePasswordDto.currentPassword);
      if (!isPasswordValid) {
        throw new UnauthorizedException({ code: 'AUTH_004', message: 'Invalid current password' });
      }
    }

    const newPasswordHash = await argon2.hash(updatePasswordDto.newPassword);
    await this.usersService.update(userId, { passwordHash: newPasswordHash });

    return { success: true };
  }
}
