"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const argon2 = __importStar(require("argon2"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    prisma;
    mailService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, prisma, mailService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.mailService = mailService;
        this.configService = configService;
    }
    async getCurrentUser(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException({ code: 'AUTH_001', message: 'User not found' });
        }
        const { passwordHash, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, hasPassword: !!passwordHash };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException({ code: 'AUTH_003', message: 'Email already in use' });
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
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException({ code: 'AUTH_001', message: 'Invalid credentials' });
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException({
                code: 'AUTH_004',
                message: 'This account uses Google sign-in. Please log in with Google.',
            });
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException({ code: 'AUTH_001', message: 'Invalid credentials' });
        }
        return this.generateTokens(user);
    }
    async googleLogin(googleProfile) {
        let user = await this.usersService.findByGoogleId(googleProfile.googleId);
        if (!user) {
            user = await this.usersService.findByEmail(googleProfile.email);
            if (user) {
                user = await this.usersService.update(user.id, {
                    googleId: googleProfile.googleId,
                    ...(googleProfile.dateOfBirth && !user.dateOfBirth ? { dateOfBirth: googleProfile.dateOfBirth } : {}),
                });
            }
            else {
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
        }
        else if (googleProfile.dateOfBirth && !user.dateOfBirth) {
            user = await this.usersService.update(user.id, {
                dateOfBirth: googleProfile.dateOfBirth,
            });
        }
        return this.generateTokens(user);
    }
    async generateTokens(user) {
        const payload = { sub: user.id };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const tokenInDb = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException({ code: 'AUTH_002', message: 'Expired token' });
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException({ code: 'AUTH_001', message: 'Invalid token user' });
            }
            await this.prisma.refreshToken.delete({
                where: { id: tokenInDb.id },
            });
            return this.generateTokens(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException({ code: 'AUTH_002', message: 'Expired or invalid token' });
        }
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { success: true };
        }
        if (user.authProvider === 'GOOGLE' && !user.passwordHash) {
            return { success: true };
        }
        await this.prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        });
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await this.prisma.passwordResetToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt,
            },
        });
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
        await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
        return { success: true };
    }
    async resetPassword(resetPasswordDto) {
        const { token, password } = resetPasswordDto;
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException({
                code: 'AUTH_005',
                message: 'Invalid or expired reset link. Please request a new one.',
            });
        }
        if (resetToken.expiresAt < new Date()) {
            await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
            throw new common_1.BadRequestException({
                code: 'AUTH_005',
                message: 'Reset link has expired. Please request a new one.',
            });
        }
        const passwordHash = await argon2.hash(password);
        await this.usersService.update(resetToken.userId, { passwordHash });
        await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
        this.logger.log(`Password reset successful for user ${resetToken.userId}`);
        return { success: true };
    }
    async updateProfile(userId, updateProfileDto) {
        const updateData = {};
        if (updateProfileDto.firstName !== undefined)
            updateData.firstName = updateProfileDto.firstName;
        if (updateProfileDto.lastName !== undefined)
            updateData.lastName = updateProfileDto.lastName;
        if (updateProfileDto.dateOfBirth !== undefined)
            updateData.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
        if (updateProfileDto.occupation !== undefined)
            updateData.occupation = updateProfileDto.occupation;
        if (updateProfileDto.experience !== undefined)
            updateData.experience = updateProfileDto.experience;
        if (updateProfileDto.skills !== undefined)
            updateData.skills = updateProfileDto.skills;
        if (updateProfileDto.occupation || updateProfileDto.experience || updateProfileDto.skills?.length) {
            updateData.profileCompleted = true;
        }
        const user = await this.usersService.update(userId, updateData);
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async logout(refreshToken) {
        await this.prisma.refreshToken.delete({
            where: { token: refreshToken },
        });
        return { success: true };
    }
    async updatePassword(userId, updatePasswordDto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException({ code: 'AUTH_001', message: 'User not found' });
        }
        if (user.passwordHash) {
            if (!updatePasswordDto.currentPassword) {
                throw new common_1.BadRequestException({ code: 'AUTH_010', message: 'Current password is required to change password' });
            }
            const isPasswordValid = await argon2.verify(user.passwordHash, updatePasswordDto.currentPassword);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException({ code: 'AUTH_004', message: 'Invalid current password' });
            }
        }
        const newPasswordHash = await argon2.hash(updatePasswordDto.newPassword);
        await this.usersService.update(userId, { passwordHash: newPasswordHash });
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map