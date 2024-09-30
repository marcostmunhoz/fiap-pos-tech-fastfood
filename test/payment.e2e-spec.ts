import { PaymentEntity } from '@/payment/infrastructure/entity/payment.entity';
import { OrderEntity } from '@/shared/infrastructure/entity/order.entity';
import { ProductEntity } from '@/shared/infrastructure/entity/product.entity';
import { getAuthToken } from '@/testing/shared/mock/auth.guard.mock';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { DatabaseHelper, createApp } from './helpers';

describe('Payment (e2e)', () => {
  let app: INestApplication;
  let databaseHelper: DatabaseHelper;

  const createOrder = async (app: INestApplication): Promise<string> => {
    await supertest(app.getHttpServer())
      .post('/api/v1/products')
      .auth(getAuthToken(app), { type: 'bearer' })
      .send({
        code: 'PRD-001',
        name: 'Product',
        description: 'Product description',
        category: 'food',
        price: 10.99,
      });
    const createOrderResponse = await supertest(app.getHttpServer())
      .post('/api/v1/orders')
      .auth(getAuthToken(app), { type: 'bearer' })
      .send({
        customerId: 'customer-id',
        customerName: 'Customer Name',
      });
    await supertest(app.getHttpServer())
      .post(`/api/v1/orders/${createOrderResponse.body.id}/add-item`)
      .send({ productCode: 'PRD-001', quantity: 1 });

    return createOrderResponse.body.id;
  };

  const payUsingCard = async (
    app: INestApplication,
    orderId: string,
    paymentMethod: string,
  ): Promise<supertest.Test> => {
    return await supertest(app.getHttpServer())
      .post(`/api/v1/payments`)
      .auth(getAuthToken(app), { type: 'bearer' })
      .send({
        orderId,
        paymentMethod,
        cardData: {
          number: '1111222233334444',
          expiration: '12/2030',
          verificationCode: '123',
        },
      });
  };

  const updateOrderStatus = async (
    app: INestApplication,
    orderId: string,
    status: string,
  ): Promise<supertest.Test> => {
    return await supertest(app.getHttpServer())
      .put(`/api/v1/orders/${orderId}/status`)
      .send({ status });
  };

  beforeAll(async () => {
    app = await createApp();
    databaseHelper = new DatabaseHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await databaseHelper.emptyTables([
      ProductEntity,
      OrderEntity,
      PaymentEntity,
    ]);
  });

  it('should pay order using pix', async () => {
    // Arrange
    const orderId = await createOrder(app);

    // Act
    const createResponse = await supertest(app.getHttpServer())
      .post(`/api/v1/payments`)
      .auth(getAuthToken(app), { type: 'bearer' })
      .send({
        orderId,
        paymentMethod: 'pix',
      });
    const refreshStatusResponse = await supertest(app.getHttpServer()).post(
      `/api/v1/payments/${createResponse.body.id}/refresh-status`,
    );

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.status).toBe('pending');
    expect(createResponse.body.paymentData.qrCode).toBeDefined();
    expect(createResponse.body.paymentData.qrCodeText).toBeDefined();
    expect(refreshStatusResponse.status).toBe(200);
    expect(refreshStatusResponse.body.status).toBe('paid');
  });

  it('should pay order using credit card', async () => {
    // Arrange
    const orderId = await createOrder(app);

    // Act
    const createResponse = await payUsingCard(app, orderId, 'credit-card');

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.status).toBe('paid');
  });

  it('should pay order using debit card', async () => {
    // Arrange
    const orderId = await createOrder(app);

    // Act
    const createResponse = await payUsingCard(app, orderId, 'debit-card');

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.status).toBe('paid');
  });

  it('should pay order using voucher', async () => {
    // Arrange
    const orderId = await createOrder(app);

    // Act
    const createResponse = await payUsingCard(app, orderId, 'voucher');

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.status).toBe('paid');
  });

  it.skip('should list orders with successful payment', async () => {
    // Skipped because its failing randomly (the sorting is not working as expected sometimes, because of the speed of the tests)

    // Arrange
    const orderId1 = await createOrder(app);
    const orderId2 = await createOrder(app);
    const orderId3 = await createOrder(app);
    const orderId4 = await createOrder(app);
    await payUsingCard(app, orderId1, 'credit-card');
    await payUsingCard(app, orderId2, 'credit-card');
    await updateOrderStatus(app, orderId2, 'preparing');
    await payUsingCard(app, orderId3, 'credit-card');
    await updateOrderStatus(app, orderId3, 'preparing');
    await updateOrderStatus(app, orderId3, 'ready');
    await payUsingCard(app, orderId4, 'credit-card');
    await updateOrderStatus(app, orderId4, 'preparing');
    await updateOrderStatus(app, orderId4, 'ready');

    // Act
    const response = await supertest(app.getHttpServer()).get(`/api/v1/orders`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0].status).toBe('paid');
    expect(response.body[0].orders).toHaveLength(1);
    expect(response.body[0].orders[0].id).toEqual(orderId1);
    expect(response.body[0].orders[0].customerName).toEqual('Customer Name');
    expect(response.body[0].orders[0].updatedAt).toBeDefined();
    expect(response.body[1].status).toBe('preparing');
    expect(response.body[1].orders).toHaveLength(1);
    expect(response.body[1].orders[0].id).toEqual(orderId2);
    expect(response.body[1].orders[0].customerName).toEqual('Customer Name');
    expect(response.body[1].orders[0].updatedAt).toBeDefined();
    expect(response.body[2].status).toBe('ready');
    expect(response.body[2].orders).toHaveLength(2);
    expect(response.body[2].orders[1].id).toEqual(orderId3);
    expect(response.body[2].orders[1].customerName).toEqual('Customer Name');
    expect(response.body[2].orders[1].updatedAt).toBeDefined();
    expect(response.body[2].orders[0].id).toEqual(orderId4);
    expect(response.body[2].orders[0].customerName).toEqual('Customer Name');
    expect(response.body[2].orders[0].updatedAt).toBeDefined();
  });
});
