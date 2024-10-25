import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {CoreModule} from '../legacy/modules/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 5432,
          username: 'username',
          password: '',
          database: 'e2e_test',
          entities: ['../src/database/entities/*.ts'],
          synchronize: false,
        }),],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
