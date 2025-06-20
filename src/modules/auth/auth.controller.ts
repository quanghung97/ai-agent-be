import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginResultDto, UserProfileDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Web only: Google OAuth2 login (redirect)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login (web only)' })
  @ApiResponse({ 
    status: HttpStatus.FOUND,
    description: 'Redirects to Google login page' 
  })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // No-op, handled by passport
  }

  // Web only: Google OAuth2 callback (redirect)
  @ApiOperation({ summary: 'Google OAuth2 callback endpoint (web only)' })
  @ApiResponse({ 
    status: HttpStatus.FOUND,
    description: 'Redirects to web URL with token',
    type: LoginResultDto 
  })
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const loginResult = await this.authService.loginWithWeb(req.user as any);
      const redirectUrl = `${this.configService.get('WEB_REDIRECT_URL')}?token=${loginResult.access_token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${this.configService.get('WEB_REDIRECT_URL')}?error=auth_failed`);
    }
  }

  // Mobile only: Google login with id_token (no redirect)
  @Post('google-mobile')
  @ApiOperation({ summary: 'Login with Google (mobile, no redirect)' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Returns JWT and user info',
    type: LoginResultDto 
  })
  async googleLogin(@Body('id_token') idToken: string) {
    return this.authService.loginWithGoogleMobile(idToken);
  }

  // Mobile only: Apple login with id_token (no redirect)
  @Post('apple-mobile')
  @ApiOperation({ summary: 'Login with Apple (mobile, no redirect)' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Returns JWT and user info',
    type: LoginResultDto 
  })
  async appleLogin(@Body('id_token') idToken: string) {
    return this.authService.loginWithAppleMobile(idToken);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Returns the user profile',
    type: UserProfileDto 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired token' 
  })
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any): UserProfileDto {
    console.log('Getting user profile:', req);
    return req.user;
  }
}
