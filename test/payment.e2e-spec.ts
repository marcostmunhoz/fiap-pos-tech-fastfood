import { PaymentEntity } from '@/payment/infrastructure/entity/payment.entity';
import { OrderEntity } from '@/shared/infrastructure/entity/order.entity';
import { ProductEntity } from '@/shared/infrastructure/entity/product.entity';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { DatabaseHelper, createApp } from './helpers';

describe('Payment (e2e)', () => {
  let app: INestApplication;
  let databaseHelper: DatabaseHelper;

  const createOrder = async (app: INestApplication): Promise<string> => {
    await supertest(app.getHttpServer()).post('/api/v1/products').send({
      code: 'PRD-001',
      name: 'Product',
      description: 'Product description',
      category: 'food',
      price: 10.99,
    });
    const createOrderResponse = await supertest(app.getHttpServer())
      .post('/api/v1/orders')
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

  it.todo('should list orders with successful payment');
});
