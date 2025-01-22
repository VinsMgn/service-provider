import { Controller, Get, Render } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('france-connect')
  @Render('france-connect')
  franceConnect() {
    const loginUrl = this.authService.getFranceConnectUrl('7f16ffb1099c05049bb41b6a6453f3b2cb981358765a055328b339b3b0e053d8', 'https://fs.vmarigner.docker.dev-franceconnect.fr/api/login-callback');
    return {
      title: 'Connexion avec FranceConnect',
      loginUrl,
    };
  }
}
