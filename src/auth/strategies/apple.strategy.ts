import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import * as fs from 'fs';

interface AppleProfile {
  id: string;
  name?: {
    firstName: string;
    lastName: string;
  };
  email: string;
}

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID') as string,
      teamID: configService.get('APPLE_TEAM_ID') as string,
      keyID: configService.get('APPLE_KEY_ID') as string,
      privateKeyString: fs.readFileSync(
        configService.get('APPLE_PRIVATE_KEY_PATH') as string,
        'utf8',
      ),
      callbackURL: '/api/v1/auth/apple/callback',
      scope: ['name', 'email'],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: AppleProfile,
    done: (error: any, user: any) => void,
  ): Promise<void> {
    const { id, name, email } = profile;
    const user = {
      email: email,
      name: name ? `${name.firstName} ${name.lastName}` : 'Apple User',
      appleId: id,
      provider: 'apple',
    };

    const registeredUser = await this.authService.validateOAuthUser(user);
    done(null, registeredUser);
  }
}
