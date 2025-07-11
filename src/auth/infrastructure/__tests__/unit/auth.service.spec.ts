import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';

describe('AuthService - unit tests', () => {
  let sut: AuthService;
  let module: TestingModule;
  let jwtService: JwtService;
  let envConfigService: EnvConfigService;
  let configService: ConfigService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, JwtModule],
      providers: [AuthService],
    }).compile();
  });

  beforeEach(async () => {
    configService = new ConfigService();
    envConfigService = new EnvConfigService(configService);

    jwtService = new JwtService({
      global: true,
      secret: envConfigService.getJwtSecret(),
      signOptions: {
        expiresIn: 86400,
        subject: 'fakeId',
      },
    });

    sut = new AuthService(jwtService, envConfigService);
  });

  it('should return a jwt', async () => {
    const result = await sut.generateJwt('fakeId');

    expect(Object.keys(result)).toEqual(['accessToken']);
    expect(typeof result.accessToken).toEqual('string');
  });

  it('should verify a jwt', async () => {
    const validToken = await sut.generateJwt('fakeId');

    const result = await sut.verifyJwt(validToken.accessToken);
    console.log(result);

    expect(validToken).not.toBeNull();

    await expect(sut.verifyJwt('fake')).rejects.toThrow();
    await expect(
      sut.verifyJwt(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      ),
    ).rejects.toThrow();
  });
});
