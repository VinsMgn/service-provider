import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { FranceConnectService } from './france-connect/france-connect.service';
import { Response } from 'express';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppController', () => {
  let appController: AppController;
  let franceConnectService: FranceConnectService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
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
              };
              return configMock[key];
            }),
          },
        },
        {
          provide: FranceConnectService,
          useValue: {
            getFranceConnectUrl: jest.fn(() => 'http://mock-redirect-url'),
            decodeJwtPayload: jest.fn((payload) => ({ name: 'Mock User' })),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    franceConnectService =
      module.get<FranceConnectService>(FranceConnectService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('renderFranceConnectPage', () => {
    it('should return a title and redirect URL', () => {
      const result = appController.renderFranceConnectPage();

      expect(result).toEqual({
        title: 'Connexion avec FranceConnect',
        redirectURL: 'http://mock-redirect-url',
      });
      expect(franceConnectService.getFranceConnectUrl).toHaveBeenCalled();
    });
  });

  describe('loginCallback', () => {
    it('should handle login callback successfully', async () => {
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // Mock session
      const session = { tokens: null } as Record<string, any>;

      await appController.loginCallback('mock-code', res, session);
      const mockResponse = {
        data: { access_token: 'mock-access-token', id_token: 'mock-id-token' },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://mock-fc-url/mock-token-url',
        expect.any(URLSearchParams),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      // Check that session.tokens was updated
      expect(session.tokens).toEqual({
        access_token: 'mock-access-token',
        id_token: 'mock-id-token',
      });

      // Check that the user was redirected
      expect(res.redirect).toHaveBeenCalledWith('/user');
    });

    it('should handle login callback failure', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Mock error'));

      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const session = { tokens: null };

      await appController.loginCallback('mock-code', res, session);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Login callback failed');
    });
  });

  describe('renderUserPage', () => {
    it('should return user info if tokens exist', async () => {
      const mockResponse = { data: { sub: 'mock-user' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const session = { tokens: { access_token: 'mock-access-token' } };

      const result = await appController.renderUserPage(res, session);

      expect(result).toEqual({
        title: 'Informations utilisateur',
        user: { name: 'Mock User' },
      });
      expect(franceConnectService.decodeJwtPayload).toHaveBeenCalledWith(
        mockResponse.data,
      );
    });

    it('should redirect to "/" if tokens are missing', async () => {
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const session = { tokens: null };

      await appController.renderUserPage(res, session);

      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('logout', () => {
    it('should redirect to logout URL', () => {
      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      const session = { tokens: { id_token: 'mock-id-token' } };

      appController.logout(res, session);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('/api/v2/session/end'),
      );
    });
  });

  describe('logoutCallback', () => {
    it('should destroy the session and redirect to "/"', () => {
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const session = {
        destroy: jest.fn((callback) => callback(null)),
      };

      appController.logoutCallback(res, session);

      expect(session.destroy).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should handle session destruction errors', () => {
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const session = {
        destroy: jest.fn((callback) => callback(new Error('Mock error'))),
      };

      appController.logoutCallback(res, session);

      expect(session.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Logout failed');
    });
  });
});
