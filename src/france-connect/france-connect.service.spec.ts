import { Test, TestingModule } from '@nestjs/testing';
import { FranceConnectService } from './france-connect.service';

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
});
