import { ConfigService } from '@nestjs/config';

export const getPlatformConfig = (configService: ConfigService) => ({
  web: {
    redirectUrl: configService.get('WEB_REDIRECT_URL') || 'http://localhost:3000/auth/success',
  },
  android: {
    redirectUrl: configService.get('ANDROID_REDIRECT_URL') || 'com.aiagent.app://oauth/callback',
  },
  ios: {
    redirectUrl: configService.get('IOS_REDIRECT_URL') || 'aiagent://oauth/callback',
  },
});
