import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: 'THROTTLER:MODULE_OPTIONS', useValue: {} },
        { provide: Symbol.for('ThrottlerStorage'), useValue: {} },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
