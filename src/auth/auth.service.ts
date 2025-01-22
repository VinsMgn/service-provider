import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getFranceConnectUrl(clientId: string, redirectUri: string): string {
    return `https://app.franceconnect.gouv.fr/api/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  }
}