import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';

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
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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

  async login(user: User) {
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
}
