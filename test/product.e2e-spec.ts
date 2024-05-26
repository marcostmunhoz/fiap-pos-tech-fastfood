import { ProductEntity } from '@/shared/infrastructure/entity/product.entity';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { DatabaseHelper, createApp } from './helpers';

describe('Product (e2e)', () => {
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
    await databaseHelper.emptyTables([ProductEntity]);
  });

  const createProduct = async (
    app: INestApplication,
    code: string,
  ): Promise<supertest.Test> => {
    const body = {
      code,
      name: 'Product',
      description: 'Product description',
      category: 'food',
      price: 10.99,
    };

    return await supertest(app.getHttpServer())
      .post('/api/v1/products')
      .send(body);
  };

  const showProduct = async (
    app: INestApplication,
    id: string,
  ): Promise<supertest.Test> => {
    return await supertest(app.getHttpServer()).get(`/api/v1/products/${id}`);
  };

  it('should create a new product', async () => {
    // Act
    const response = await createProduct(app, 'PRD-001');

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.code).toBe('PRD-001');
    expect(response.body.name).toBe('Product');
    expect(response.body.description).toBe('Product description');
    expect(response.body.category).toBe('food');
    expect(response.body.price).toBe(10.99);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });

  it('should edit an existing product', async () => {
    // Arrange
    const createBody = {
      code: 'PRD-001',
      name: 'Product 1',
      description: 'Product 1 description',
      category: 'food',
      price: 15.99,
    };
    const editBody = {
      code: 'PRD-002',
      name: 'Product 2',
      description: 'Product 2 description',
      category: 'drink',
      price: 19.99,
    };

    // Act
    const createResponse = await supertest(app.getHttpServer())
      .post('/api/v1/products')
      .send(createBody);
    const editResponse = await supertest(app.getHttpServer())
      .put(`/api/v1/products/${createResponse.body.id}`)
      .send(editBody);
    const showResponse = await showProduct(app, createResponse.body.id);

    // Assert
    expect(createResponse.status).toBe(201);
    expect(editResponse.status).toBe(204);
    expect(showResponse.status).toBe(200);
    expect(showResponse.body.id).toBe(createResponse.body.id);
    expect(showResponse.body.code).toBe(editBody.code);
    expect(showResponse.body.name).toBe(editBody.name);
    expect(showResponse.body.description).toBe(editBody.description);
    expect(showResponse.body.category).toBe(editBody.category);
    expect(showResponse.body.price).toBe(editBody.price);
    expect(showResponse.body.createdAt).toBeDefined();
    expect(showResponse.body.updatedAt).toBeDefined();
  });

  it('should delete an existing product', async () => {
    // Arrange
    const createResponse = await createProduct(app, 'PRD-001');

    // Act
    const deleteResponse = await supertest(app.getHttpServer()).delete(
      `/api/v1/products/${createResponse.body.id}`,
    );
    const showResponse = await supertest(app.getHttpServer()).get(
      `/api/v1/products/${createResponse.body.id}`,
    );

    // Assert
    expect(createResponse.status).toBe(201);
    expect(deleteResponse.status).toBe(204);
    expect(showResponse.status).toBe(404);
  });
});
