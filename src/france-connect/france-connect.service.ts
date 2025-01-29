import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FranceConnectService {
  getFranceConnectUrl(clientId: string, redirectUri: string): string {
    const state = uuidv4();
    const nonce = uuidv4();
    return `https://fcp-low.integ01.dev-franceconnect.fr/api/v2/authorize?response_type=code&acr_values=eidas1&scope=openid+gender+given_name+family_name+email+preferred_username&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&nonce=${nonce}`;
  }

  decodeJwtPayload(token: string): Record<string, any> | null {
    try {
      // Découper le token en 3 parties (header, payload, signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format.');
      }

      // La partie payload est la deuxième partie
      const payloadBase64 = parts[1];

      // Décoder le Base64URL en JSON
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/'),
      );

      // Parser la chaîne JSON pour obtenir un objet
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error('Error decoding JWT payload:', error);
      return null;
    }
  }
}
