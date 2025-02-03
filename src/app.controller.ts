import { Controller, Get, Query, Render, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FranceConnectService } from './services/france-connect/france-connect.service';
import { v4 as uuidv4 } from 'uuid';
import { ROUTES } from './utils/enums/routes.enum';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly franceConnectService: FranceConnectService,
  ) {}

  /**
   * Renders the FranceConnect page by generating a redirect URL and returning it along with a title.
   * @returns An object containing the title of the page and the redirect URL to go to identity provider.
   */
  @Get()
  @Render('france-connect')
  renderFranceConnectPage(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): { title: string; redirectURL: string } {
    const redirectURL = this.franceConnectService.getFranceConnectUrl(
      this.configService.get<string>('CLIENT_ID') || '',
      `${this.configService.get<string>('FS_URL')}${this.configService.get<string>('LOGIN_CALLBACK')}`,
    );
    return {
      title: 'Connexion avec FranceConnect',
      redirectURL,
    };
  }

  /**
   * Handles the login callback by exchanging the authorization code for tokens
   * and storing them in the session. Redirects the user to the /user page upon success.
   *
   * @param authCode - The authorization code received from the OAuth provider.
   * @param res - The response object used to send the HTTP response.
   * @param session - The session object used to store tokens.
   * @returns A promise that resolves to void.
   *
   * @throws Will send a 500 status response if the session is not available or if the token exchange fails.
   */
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
      res.redirect(ROUTES.USER);
    } catch (error) {
      console.error('Error during login callback:', error);
      res.status(500).send('Login callback failed');
    }
  }

  /**
   * Renders the user page with user information fetched from France Connect.
   *
   * @param res - The response object used to send the HTTP response.
   * @param session - The session object containing user tokens.
   *
   * @returns An object containing the title and user information if successful, otherwise redirects or sends an error response.
   *
   * @throws Will send a 500 status code response if there is an error while fetching user info.
   */
  @Get('user')
  @Render('user')
  async renderUserPage(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    if (!session.tokens) {
      res.redirect(ROUTES.HOME);
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
      // Store safely the user info in the session
      session.user = data;
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

  /**
   * Handles the logout process by redirecting the user to the appropriate logout URL.
   *
   * @param res - The response object used to redirect the user.
   * @param session - The session object containing user session data.
   **/
  @Get('logout')
  logout(@Res() res: Response, @Session() session: Record<string, any>) {
    const randomUUID = uuidv4();
    const tokenHint = session.tokens.id_token;
    const query = {
      id_token_hint: tokenHint,
      state: `state${randomUUID}`,
      post_logout_redirect_uri: `${this.configService.get('FS_URL')}${this.configService.get('LOGOUT_CALLBACK')}`,
    };
    const logoutURL =
      this.configService.get('FC_URL') + this.configService.get('LOGOUT_URL');
    const queryParams = new URLSearchParams(query).toString();
    const redirectURL = `${logoutURL}?${queryParams}`;
    return res.redirect(redirectURL);
  }

  /**
   * Callback de déconnexion pour détacher la session
   * @param res Response from FC logout
   * @param session Session to destroy
   */
  @Get('api/logout-callback')
  logoutCallback(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    session.destroy((err: Error) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Logout failed');
      } else {
        res.redirect(ROUTES.HOME);
      }
    });
  }
}
