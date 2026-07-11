"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    constructor(configService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID') || 'not-configured',
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET') || 'not-configured',
            callbackURL: configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/api/v1/auth/google/callback',
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.birthday.read'],
        });
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, name, emails } = profile;
        let dateOfBirth;
        try {
            const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                const primaryBirthday = data.birthdays?.find((b) => b.metadata?.primary) || data.birthdays?.[0];
                if (primaryBirthday?.date) {
                    const { year, month, day } = primaryBirthday.date;
                    if (year && month && day) {
                        dateOfBirth = new Date(year, month - 1, day);
                    }
                    else if (month && day) {
                        dateOfBirth = new Date(1900, month - 1, day);
                    }
                }
            }
        }
        catch (e) {
            console.error('Failed to fetch birthday from Google', e);
        }
        const user = {
            googleId: id,
            email: emails?.[0]?.value,
            firstName: name?.givenName,
            lastName: name?.familyName,
            dateOfBirth,
        };
        done(null, user);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map