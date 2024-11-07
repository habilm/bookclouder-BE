import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../src/utility/auth.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: APP_GUARD,
          useExisting: AuthGuard,
          // ^^^^^^^^ notice the use of 'useExisting' instead of 'useClass'
        },
        AuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('http://127.0.0.1:3000/auth/signup')
      .send({
        fullName: 'fasd',
        email: 'habil2@yopmail.com',
        password: '12343',
      })
      .expect(201);
  });
});
