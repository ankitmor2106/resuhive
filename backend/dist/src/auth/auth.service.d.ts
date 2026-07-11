import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, LoginDto, ResetPasswordDto, UpdateProfileDto, UpdatePasswordDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly prisma;
    private readonly mailService;
    private readonly configService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService, mailService: MailService, configService: ConfigService);
    getCurrentUser(userId: string): Promise<{
        hasPassword: boolean;
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: Date | null;
        occupation: string | null;
        experience: string | null;
        skills: import("@prisma/client/runtime/client").JsonValue | null;
        authProvider: import("@prisma/client").$Enums.AuthProvider;
        googleId: string | null;
        profileCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    googleLogin(googleProfile: {
        googleId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        dateOfBirth?: Date;
    }): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    private generateTokens;
    refresh(refreshToken: string): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: Date | null;
        occupation: string | null;
        experience: string | null;
        skills: import("@prisma/client/runtime/client").JsonValue | null;
        authProvider: import("@prisma/client").$Enums.AuthProvider;
        googleId: string | null;
        profileCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
    }>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        success: boolean;
    }>;
}
