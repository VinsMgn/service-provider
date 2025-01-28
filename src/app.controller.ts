import { Controller, Get, Query, Render, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AppService } from './app.service';
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

  @Get('api/login-callback')
   async loginCallback(
    @Query('code') authCode: string,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const body = {
      grant_type: 'authorization_code',
      // redirect_uri: `${this.configService.get<string>('FS_URL')}${this.configService.get<string>('LOGIN_CALLBACK')}`,
      redirect_uri: `https://localhost:3000/api/login-callback`,
      client_id: this.configService.get<string>('CLIENT_ID'),
      client_secret: this.configService.get<string>('CLIENT_SECRET'),
      code: authCode,
    };
    console.log("🚀 ~ AppController ~ body:", body)

    try {
      const response = await axios({
        method: 'POST',
        data: body.toString(),
        url: `${this.configService.get<string>('FC_URL')}${this.configService.get<string>('TOKEN_URL')}`,
      })
      // const response = await axios.post(`${this.configService.get<string>('FC_URL')}${this.configService.get<string>('TOKEN_URL')}`, body.toString(), {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      // });
      const data = response.data;
      console.log("🚀 ~ AppController ~ data:", data)
      session.tokens = data;
      res.redirect('/user');
    } catch (error) {
      console.error('Error during login callback:', error.data);
      res.status(500).send('Login callback failed');
    }
  }

  @Get('user')
  @Render('user')
  async renderUserPage(@Res() res: Response, @Session() session: Record<string, any>) {
    if (!session.tokens) {
      res.redirect('/');
      return;
    }

    const accessToken = session.tokens.access_token;
    try {
      const response = await axios.get(`${this.configService.get<string>('FC_URL')}${this.configService.get<string>('USER_INFO_URL')}?schema=openid`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      console.log("🚀 ~ AppController ~ data:", data)
      return {
        title: 'Informations utilisateur',
        user: data,
      };
    } catch (error) {
      console.error('Error while fetching user info:', error);
      res.status(500).send('Failed to fetch user info');
    }
  }
}

