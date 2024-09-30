import { OrderEntity } from '@/shared/infrastructure/entity/order.entity';
import { ProductEntity } from '@/shared/infrastructure/entity/product.entity';
import { getAuthToken } from '@/testing/shared/mock/auth.guard.mock';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { DatabaseHelper, createApp } from './helpers';

describe('Order (e2e)', () => {
  let app: INestApplication;
  let databaseHelper: DatabaseHelper;

  const createOrder = async (
    app: INestApplication,
  ): Promise<supertest.Test> => {
    const body = {
      customerId: 'customer-id',
      customerName: 'Customer Name',
    };

    return await supertest(app.getHttpServer())
      .post('/api/v1/orders')
      .auth(getAuthToken(app), { type: 'bearer' })
      .send(body);
  };

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

  const addProductToOrder = async (
    app: INestApplication,
    orderId: string,
    productCode: string,
    quantity: number,
  ): Promise<supertest.Test> => {
    const body = {
      productCode,
      quantity,
    };

    return await supertest(app.getHttpServer())
      .post(`/api/v1/orders/${orderId}/add-item`)
      .auth(getAuthToken(app), { type: 'bearer' })
      .send(body);
  };

  const removeItemFromOrder = async (
    app: INestApplication,
    orderId: string,
    productCode: string,
  ): Promise<supertest.Test> => {
    return await supertest(app.getHttpServer())
      .post(`/api/v1/orders/${orderId}/remove-item`)
      .auth(getAuthToken(app), { type: 'bearer' })
      .send({ productCode });
  };

  const changeOrderItemQuantity = async (
    app: INestApplication,
    orderId: string,
    productCode: string,
    quantity: number,
  ): Promise<supertest.Test> => {
    const body = {
      productCode,
      quantity,
    };

    return await supertest(app.getHttpServer())
      .post(`/api/v1/orders/${orderId}/change-item-quantity`)
      .auth(getAuthToken(app), { type: 'bearer' })
      .send(body);
  };

  const showOrder = async (
    app: INestApplication,
    orderId: string,
  ): Promise<supertest.Test> => {
    return await supertest(app.getHttpServer())
      .get(`/api/v1/orders/${orderId}`)
      .auth(getAuthToken(app), { type: 'bearer' })
      .send();
  };

  beforeAll(async () => {
    app = await createApp();
    databaseHelper = new DatabaseHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await databaseHelper.emptyTables([ProductEntity, OrderEntity]);
  });

  it('should show available products', async () => {
    // Arrange
    const createProduct1Body = {
      code: 'PRD-001',
      name: 'Product 1',
      description: 'Product description 1',
      category: 'food',
      price: 10.99,
    };
    const createProduct2Body = {
      code: 'PRD-002',
      name: 'Product 2',
      description: 'Product description 2',
      category: 'drink',
      price: 15.8,
    };
    await supertest(app.getHttpServer())
      .post('/api/v1/products')
      .send(createProduct1Body);
    await supertest(app.getHttpServer())
      .post('/api/v1/products')
      .send(createProduct2Body);

    // Act
    const response = await supertest(app.getHttpServer()).get(
      '/api/v1/orders/products',
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].category).toBe('drink');
    expect(response.body[0].products).toHaveLength(1);
    expect(response.body[0].products[0].code).toBe('PRD-002');
    expect(response.body[0].products[0].name).toBe('Product 2');
    expect(response.body[0].products[0].description).toBe(
      'Product description 2',
    );
    expect(response.body[0].products[0].price).toBe(15.8);
    expect(response.body[1].category).toBe('food');
    expect(response.body[1].products).toHaveLength(1);
    expect(response.body[1].products[0].code).toBe('PRD-001');
    expect(response.body[1].products[0].name).toBe('Product 1');
    expect(response.body[1].products[0].description).toBe(
      'Product description 1',
    );
    expect(response.body[1].products[0].price).toBe(10.99);
  });

  it('should create a new order', async () => {
    // Act
    const response = await createOrder(app);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should create a new order without optional data', async () => {
    // Arrange
    const body = {
      customerId: 'customer-id',
    };

    // Act
    const response = await supertest(app.getHttpServer())
      .post('/api/v1/orders')
      .auth(getAuthToken(app), { type: 'bearer' })
      .send(body);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should add items to an existing order', async () => {
    // Arrange
    const createOrderResponse = await createOrder(app);
    await createProduct(app, 'PRD-001');
    await createProduct(app, 'PRD-002');

    // Act
    const addItem1Response = await addProductToOrder(
      app,
      createOrderResponse.body.id,
      'PRD-001',
      2,
    );
    const addItem2Response = await addProductToOrder(
      app,
      createOrderResponse.body.id,
      'PRD-002',
      3,
    );
    const showOrderResponse = await showOrder(app, createOrderResponse.body.id);

    // Assert
    expect(createOrderResponse.status).toBe(201);
    expect(addItem1Response.status).toBe(204);
    expect(addItem2Response.status).toBe(204);
    expect(showOrderResponse.status).toBe(200);
    expect(showOrderResponse.body.items).toHaveLength(2);
    expect(showOrderResponse.body.items[0].code).toBe('PRD-001');
    expect(showOrderResponse.body.items[0].quantity).toBe(2);
    expect(showOrderResponse.body.items[1].code).toBe('PRD-002');
    expect(showOrderResponse.body.items[1].quantity).toBe(3);
    expect(showOrderResponse.body.total).toBe(54.95);
  });

  it('should remove items from an existing order', async () => {
    // Arrange
    const createOrderResponse = await createOrder(app);
    await createProduct(app, 'PRD-001');
    await createProduct(app, 'PRD-002');
    await addProductToOrder(app, createOrderResponse.body.id, 'PRD-001', 1);
    await addProductToOrder(app, createOrderResponse.body.id, 'PRD-002', 1);

    // Act
    const removeItemResponse = await removeItemFromOrder(
      app,
      createOrderResponse.body.id,
      'PRD-001',
    );
    const showOrderResponse = await showOrder(app, createOrderResponse.body.id);

    // Assert
    expect(removeItemResponse.status).toBe(204);
    expect(showOrderResponse.status).toBe(200);
    expect(showOrderResponse.body.items).toHaveLength(1);
    expect(showOrderResponse.body.items[0].code).toBe('PRD-002');
  });

  it('should change the quantity of an item in an existing order', async () => {
    // Arrange
    const createOrderResponse = await createOrder(app);
    await createProduct(app, 'PRD-001');
    await addProductToOrder(app, createOrderResponse.body.id, 'PRD-001', 1);

    // Act
    await changeOrderItemQuantity(
      app,
      createOrderResponse.body.id,
      'PRD-001',
      5,
    );
    const showOrderResponse = await showOrder(app, createOrderResponse.body.id);

    // Assert
    expect(showOrderResponse.status).toBe(200);
    expect(showOrderResponse.body.items).toHaveLength(1);
    expect(showOrderResponse.body.items[0].quantity).toBe(5);
    expect(showOrderResponse.body.total).toBe(54.95);
  });
});
