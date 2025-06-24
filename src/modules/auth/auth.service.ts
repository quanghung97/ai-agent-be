import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as appleSignin from 'apple-signin-auth'; // Add this import

interface OAuthUserData {
  email: string;
  googleId?: string;
  appleId?: string;
  name?: string;
  avatar?: string;
  provider?: string;
}

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize OAuth2Client with value from .env
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async verifyGoogleTokenMobile(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: [
        this.configService.get<string>('GOOGLE_CLIENT_ID') || '',
        this.configService.get<string>('GOOGLE_CLIENT_ID_IOS') || '',
        this.configService.get<string>('GOOGLE_CLIENT_ID_ANDROID') || '',
      ], // <-- Use configService
    });
    const payload = ticket.getPayload();

    return {
      email: payload?.email,
      name: payload?.name,
      picture: payload?.picture,
      googleId: payload?.sub,
    };
  }

  async loginWithGoogleMobile(idToken: string) {
    const googleUser = await this.verifyGoogleTokenMobile(idToken);
    if (!googleUser?.email) {
      throw new Error('Invalid Google token');
    }
    const user = await this.validateOAuthUser({
      email: googleUser.email,
      googleId: googleUser.googleId,
      name: googleUser.name,
      avatar: googleUser.picture,
      provider: 'google',
    });
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
      },
    };
  }

  async verifyAppleTokenMobile(idToken: string) {
    try {
      const applePayload = await appleSignin.verifyIdToken(idToken, {
        audience: this.configService.get<string>('APPLE_CLIENT_ID'),
        ignoreExpiration: false,
      });
      return {
        email: applePayload.email,
        name: null,
        appleId: applePayload.sub,
      };
    } catch (err) {
      throw new Error('Invalid Apple token');
    }
  }

  async loginWithAppleMobile(idToken: string) {
    const appleUser = await this.verifyAppleTokenMobile(idToken);
    if (!appleUser?.appleId) {
      throw new Error('Invalid Apple token');
    }
    const user = await this.validateOAuthUser({
      email: appleUser.email,
      appleId: appleUser.appleId,
      name: appleUser.name || `Apple User #${this.shortId()}`,
      provider: 'apple',
    });
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
      },
    };
  }

  async validateOAuthUser(userData: OAuthUserData): Promise<User> {
    let user = await this.userRepository.findOne({
      where: [
        { email: userData.email },
        { googleId: userData.googleId },
        { appleId: userData.appleId },
      ],
    });

    if (!user) {
      user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    } else {
      // Update user with new OAuth data if needed
      if (userData.googleId && !user.googleId) {
        user.googleId = userData.googleId;
      }
      if (userData.appleId && !user.appleId) {
        user.appleId = userData.appleId;
      }
      await this.userRepository.save(user);
    }

    return user;
  }

  async loginWithWeb(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
      },
    };
  }

  async verify(headerAuthorization: string) {
    try {
      const decoded: {
        sub: string;
        roles: string[];
        token_type: string;
        iat: number;
        exp: number;
      } = await this.jwtService.verify(headerAuthorization.split(' ')[1]);

      const user = await this.userRepository.findOne({
        where: { id: Equal(decoded.sub) },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  // Generate a short random string (alphanumeric, like a short UUID)
  private shortId(): string {
    return (Date.now().toString(36) + Math.random().toString(36).substring(2, 8)).toUpperCase();
  }
}
