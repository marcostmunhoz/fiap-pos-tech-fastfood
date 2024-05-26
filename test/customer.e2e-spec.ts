import { CustomerEntity } from '@/customer/infrastructure/entity/customer.entity';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { DatabaseHelper, createApp, getRandomFakeCpf } from './helpers';

describe('Customer (e2e)', () => {
  let app: INestApplication;
  let databaseHelper: DatabaseHelper;

  beforeAll(async () => {
    app = await createApp();
    databaseHelper = new DatabaseHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await databaseHelper.emptyTables([CustomerEntity]);
  });

  it('should create a new customer', async () => {
    // Arrange
    const body = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: getRandomFakeCpf(),
    };

    // Act
    const response = await supertest(app.getHttpServer())
      .post('/api/v1/customers')
      .send(body);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(body.name);
  });

  it('should create a new customer without optional data', async () => {
    // Arrange
    const body = {};

    // Act
    const response = await supertest(app.getHttpServer())
      .post('/api/v1/customers')
      .send(body);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(null);
  });
});
