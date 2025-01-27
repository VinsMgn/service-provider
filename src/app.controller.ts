import { Controller, Get, Query, Render, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { AuthService } from './auth/auth.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService:AuthService, private readonly configService: ConfigService) {}


  @Get()
  @Render('france-connect')
  renderFranceConnectPage(@Res() res: Response, @Session() session: Record<string, any>) {
      const redirectURL = this.authService.getFranceConnectUrl('7f16ffb1099c05049bb41b6a6453f3b2cb981358765a055328b339b3b0e053d8', 'https://fs.vmarigner.docker.dev-franceconnect.fr/api/login-callback');
      return {
        title: 'Connexion avec FranceConnect',
        redirectURL,
      };
  }

  @Get('login-callback')
  async loginCallback(
    @Query('code') authCode: string,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const body = {
      grant_type: 'authorization_code',
      redirect_uri: `${this.configService.get<string>('FS_URL')}${this.configService.get<string>('LOGIN_CALLBACK')}`,
      client_id: this.configService.get<string>('CLIENT_ID'),
      client_secret: this.configService.get<string>('CLIENT_SECRET'),
      code: authCode,
    };

    try {
      const response = await axios.post(`${this.configService.get<string>('FC_URL')}${this.configService.get<string>('TOKEN_URL')}`, body);
      const data = response.data;
      session.tokens = data;
      res.redirect('/user');
    } catch (error) {
      console.error('Error during login callback:', error);
      res.status(500).send('Login callback failed');
    }
  }
}

