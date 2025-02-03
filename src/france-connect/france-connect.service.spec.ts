import { Test, TestingModule } from '@nestjs/testing';
import { FranceConnectService } from './france-connect.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
jest.mock('uuid');

describe('FranceConnectService', () => {
  let service: FranceConnectService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FranceConnectService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const configMock = {
                FS_URL: 'http://mock-fs-url',
                LOGIN_CALLBACK: '/api/login-callback',
                CLIENT_ID: 'mock-client-id',
                CLIENT_SECRET: 'mock-client-secret',
                FC_URL: 'http://mock-fc-url',
                TOKEN_URL: '/api/v2/token',
                USER_INFO_URL: '/api/v2/userinfo',
                LOGOUT_URL: '/api/v2/session/end',
                AUTHORIZE_URL: '/api/v2/authorize',
              };
              return configMock[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FranceConnectService>(FranceConnectService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
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
        `http://mock-fc-url/api/v2/authorize?response_type=code&acr_values=eidas1&scope=openid+gender+given_name+family_name+email+preferred_username&client_id=${clientId}&redirect_uri=${redirectUri}&state=${mockState}&nonce=${mockNonce}`,
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
