import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ResetPasswordDto, UpdateProfileDto, UpdatePasswordDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getCurrentUser(user: {
        userId: string;
    }): Promise<{
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
    login(loginDto: LoginDto): Promise<{
        user: any;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
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
    logout(refreshToken: string): Promise<{
        success: boolean;
    }>;
    googleAuth(): void;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
    updateProfile(user: {
        userId: string;
    }, updateProfileDto: UpdateProfileDto): Promise<{
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
    updatePassword(user: {
        userId: string;
    }, updatePasswordDto: UpdatePasswordDto): Promise<{
        success: boolean;
    }>;
}
