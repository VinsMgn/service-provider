import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IdentityService {
  private privateKey: string;
  private publicKey: string;
  private users = new Map<string, any>(); // Stockage temporaire en mémoire
  constructor(private readonly configService: ConfigService) {
    // Charger les clés privées et publiques
    this.privateKey = fs.readFileSync(
      path.resolve(
        this.configService.get<string>('PRIVATE_KEY_PATH') as string,
      ),
      'utf8',
    );
    this.publicKey = fs.readFileSync(
      path.resolve(this.configService.get<string>('PUBLIC_KEY_PATH') as string),
      'utf8',
    );
  }

  signUserData(userData: any): string {
    return jwt.sign(userData, this.privateKey, {
      algorithm: 'ES256',
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ['ES256'],
      });
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  saveUser(sessionId: string, userData: any): void {
    this.users.set(sessionId, userData);
  }

  getUser(sessionId: string): any {
    return this.users.get(sessionId);
  }

  deleteUser(sessionId: string): void {
    this.users.delete(sessionId);
  }
}
