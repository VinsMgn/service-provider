import { Test, TestingModule } from '@nestjs/testing';
import { FranceConnectService } from './france-connect.service';
import { v4 as uuidv4 } from 'uuid';
jest.mock('uuid');

describe('FranceConnectService', () => {
  let service: FranceConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FranceConnectService],
    }).compile();

    service = module.get<FranceConnectService>(FranceConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFranceConnectUrl', () => {
    it('should generate a valid FranceConnect URL', () => {
      const clientId = 'test-client-id';
      const redirectUri = 'http://localhost/callback';
      const mockState = 'mock-state';
      const mockNonce = 'mock-nonce';

      (uuidv4 as jest.Mock)
        .mockReturnValueOnce(mockState)
        .mockReturnValueOnce(mockNonce);

      const url = service.getFranceConnectUrl(clientId, redirectUri);

      expect(url).toBe(
        `https://fcp-low.integ01.dev-franceconnect.fr/api/v2/authorize?response_type=code&acr_values=eidas1&scope=openid+gender+given_name+family_name+email+preferred_username&client_id=${clientId}&redirect_uri=${redirectUri}&state=${mockState}&nonce=${mockNonce}`,
      );
    });
  });

  describe('decodeJwtPayload', () => {
    it('should decode a valid JWT payload', () => {
      const token = 'header.payload.signature';
      const payload = { sub: '1234567890', name: 'John Doe', admin: true };
      const payloadBase64 = Buffer.from(JSON.stringify(payload))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const validToken = `header.${payloadBase64}.signature`;

      const result = service.decodeJwtPayload(validToken);

      expect(result).toEqual(payload);
    });

    it('should return null for an invalid JWT format', () => {
      const invalidToken = 'invalid-token';

      const result = service.decodeJwtPayload(invalidToken);

      expect(result).toBeNull();
    });

    it('should return null for a malformed payload', () => {
      const malformedPayload = 'header.malformed-payload.signature';

      const result = service.decodeJwtPayload(malformedPayload);

      expect(result).toBeNull();
    });
  });
});
