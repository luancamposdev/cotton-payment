import {
  INestApplication,
  CanActivate,
  ExecutionContext,
  Module,
  Controller,
  Get,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@core/users/entities/user.entity';

interface TestUser {
  role: Role;
}

interface TestAuthRequest extends Request {
  user?: TestUser;
}

class FakeAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<TestAuthRequest>();
    const roleHeader = (
      req.headers['x-role'] as string | undefined
    )?.toUpperCase();
    req.user = roleHeader
      ? { role: Role[roleHeader as keyof typeof Role] }
      : undefined;
    return true;
  }
}

@Controller('demo')
class DemoController {
  @Get('open')
  open() {
    return { ok: true, access: 'open' };
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  admin() {
    return { ok: true, access: 'admin' };
  }

  @Get('customer-or-admin')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  customerOrAdmin() {
    return { ok: true, access: 'customer-or-admin' };
  }
}

@Module({
  controllers: [DemoController],
  providers: [
    { provide: APP_GUARD, useClass: FakeAuthGuard },
    RolesGuard,
    Reflector,
    { provide: APP_GUARD, useExisting: RolesGuard },
  ],
})
class DemoModule {}

describe('RBAC e2e (Roles decorator + RolesGuard)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DemoModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /demo/open permite acesso sem role', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .get('/demo/open')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({ ok: true, access: 'open' });
      });
  });

  it('GET /demo/admin nega acesso sem user', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer()).get('/demo/admin').expect(403);
  });

  it('GET /demo/admin permite acesso com role ADMIN', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .get('/demo/admin')
      .set('x-role', 'ADMIN')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({ ok: true, access: 'admin' });
      });
  });

  it('GET /demo/admin nega acesso com role CUSTOMER', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .get('/demo/admin')
      .set('x-role', 'CUSTOMER')
      .expect(403);
  });

  it('GET /demo/customer-or-admin permite acesso com role CUSTOMER', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .get('/demo/customer-or-admin')
      .set('x-role', 'CUSTOMER')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({ ok: true, access: 'customer-or-admin' });
      });
  });

  it('GET /demo/customer-or-admin permite acesso com role ADMIN', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .get('/demo/customer-or-admin')
      .set('x-role', 'ADMIN')
      .expect(200);
  });

  it('GET /demo/customer-or-admin nega acesso sem user', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .get('/demo/customer-or-admin')
      .expect(403);
  });
});
