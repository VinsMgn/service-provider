import { Controller, Get, Render } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('france-connect')
  @Render('france-connect')
  franceConnect() {
    const loginUrl = this.authService.getFranceConnectUrl('your-client-id', 'http://localhost:3000/auth/callback');
    return {
      title: 'Connexion avec FranceConnect',
      loginUrl,
    };
  }
}
