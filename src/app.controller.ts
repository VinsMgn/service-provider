import { Controller, Get, Query, Render, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FranceConnectService } from './france-connect/france-connect.service';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly franceConnectService: FranceConnectService,
  ) {}

  @Get()
  @Render('france-connect')
  renderFranceConnectPage() {
    const redirectURL = this.franceConnectService.getFranceConnectUrl(
      '7f16ffb1099c05049bb41b6a6453f3b2cb981358765a055328b339b3b0e053d8',
      'https://fs.vmarigner.docker.dev-franceconnect.fr/api/login-callback',
    );
    return {
      title: 'Connexion avec FranceConnect',
      redirectURL,
    };
  }

  @Get('api/login-callback')
  async loginCallback(
    @Query('code') authCode: string,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append(
      'redirect_uri',
      `${this.configService.get<string>('FS_URL')}${this.configService.get<string>('LOGIN_CALLBACK')}`,
    );
    params.append(
      'client_id',
      this.configService.get<string>('CLIENT_ID') as string,
    );
    params.append(
      'client_secret',
      this.configService.get<string>('CLIENT_SECRET') as string,
    );
    params.append('code', authCode);

    try {
      const response = await axios({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        data: params,
        url: `${this.configService.get<string>('FC_URL')}${this.configService.get<string>('TOKEN_URL')}`,
      });
      const data = response.data;
      if (!session) {
        console.error(
          'Session is undefined. Ensure session middleware is configured correctly.',
        );
        res.status(500).send('Session is not available');
        return;
      }
      session.tokens = data;
      res.redirect('/user');
    } catch (error) {
      console.error('Error during login callback:', error);
      res.status(500).send('Login callback failed');
    }
  }

  @Get('user')
  @Render('user')
  async renderUserPage(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    if (!session.tokens) {
      res.redirect('/');
      return;
    }

    const accessToken = session.tokens.access_token;
    try {
      const response = await axios.get(
        `${this.configService.get<string>('FC_URL')}${this.configService.get<string>('USER_INFO_URL')}?schema=openid`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = response.data;
      const user = this.franceConnectService.decodeJwtPayload(data);
      return {
        title: 'Informations utilisateur',
        user,
      };
    } catch (error) {
      console.error('Error while fetching user info:', error);
      res.status(500).send('Failed to fetch user info');
    }
  }
}
