import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  getFranceConnectUrl(clientId: string, redirectUri: string): string {
    const state = uuidv4();
    const nonce = uuidv4();
    return `https://fcp-low.integ01.dev-franceconnect.fr/api/v2/authorize?response_type=code&acr_values=eidas1&scope=openid+gender+given_name+family_name+email+preferred_username&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&nonce=${nonce}`;
  }
}