import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'not-configured',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'not-configured',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/api/v1/auth/google/callback',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.birthday.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails } = profile;
    
    let dateOfBirth: Date | undefined;
    try {
      const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        const primaryBirthday = data.birthdays?.find((b: any) => b.metadata?.primary) || data.birthdays?.[0];
        if (primaryBirthday?.date) {
          const { year, month, day } = primaryBirthday.date;
          if (year && month && day) {
            dateOfBirth = new Date(year, month - 1, day);
          } else if (month && day) {
            dateOfBirth = new Date(1900, month - 1, day);
          }
        }
      }
    } catch (e) {
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
}
