import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { getPlatformConfig } from 'src/config/platform.config';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginResultDto, UserProfileDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private platformConfig;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.platformConfig = getPlatformConfig(configService);
  }

  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiQuery({ 
    name: 'platform', 
    enum: ['web', 'android', 'ios'], 
    required: false,
    description: 'Target platform for redirect' 
  })
  @ApiResponse({ 
    status: HttpStatus.FOUND,
    description: 'Redirects to Google login page' 
  })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Query('platform') platform: string, @Req() req: any) {
    // Store platform info in session for callback
    if (req?.session) {
      req.session.platform = platform || 'web';
    }
  }

  @ApiOperation({ summary: 'Google OAuth2 callback endpoint' })
  @ApiResponse({ 
    status: HttpStatus.FOUND,
    description: 'Redirects to platform-specific URL with token',
    type: LoginResultDto 
  })
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const loginResult = await this.authService.login(req.user as any);
      const platform = req.session?.platform || 'web';
      
      const baseRedirectUrl = this.platformConfig[platform].redirectUrl;

      // Construct redirect URL based on platform
      let redirectUrl: string;
      switch (platform) {
        case 'android':
        case 'ios':
          // Deep link URL for mobile apps
          redirectUrl = `${baseRedirectUrl}?token=${loginResult.access_token}`;
          break;
        default:
          // Web redirect
          redirectUrl = `${baseRedirectUrl}?token=${loginResult.access_token}`;
      }

      console.log('Google Auth Callback:', { platform, redirectUrl });
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect(`${this.platformConfig.web.redirectUrl}?error=auth_failed`);
    }
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
