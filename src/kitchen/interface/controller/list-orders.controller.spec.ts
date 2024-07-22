import {
  ListOrdersUseCase,
  Output,
} from '@/kitchen/application/use-case/list-orders.use-case';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { ListOrdersController } from './list-orders.controller';

describe('ListOrdersController', () => {
  let useCaseMock: jest.Mocked<ListOrdersUseCase>;
  let controller: ListOrdersController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListOrdersUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListOrdersUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [ListOrdersController],
    }).compile();

    controller = module.get<ListOrdersController>(ListOrdersController);
  });

  describe('execute', () => {
    it('should return the existing orders grouped by status', async () => {
      // Arrange
      const order1 = {
        id: 'order-id-1',
        customerName: 'Customer 1',
        items: [
          {
            code: 'PRD-001',
            name: 'X-Burger',
            price: 1500,
            quantity: 2,
          },
        ],
        updatedAt: new Date('2021-01-01T00:00:00Z'),
      };
      const order2 = {
        id: 'order-id-2',
        customerName: 'Customer 2',
        items: [],
        updatedAt: new Date('2021-01-02T00:00:00Z'),
      };
      const order3 = {
        id: 'order-id-3',
        customerName: 'Customer 3',
        items: [],
        updatedAt: new Date('2021-01-03T00:00:00Z'),
      };
      const order4 = {
        id: 'order-id-4',
        customerName: 'Customer 4',
        items: [],
        updatedAt: new Date('2021-01-04T00:00:00Z'),
      };
      const order5 = {
        id: 'order-id-5',
        customerName: 'Customer 5',
        items: [],
        updatedAt: new Date('2021-01-05T00:00:00Z'),
      };
      const order6 = {
        id: 'order-id-6',
        customerName: 'Customer 6',
        items: [],
        updatedAt: new Date('2021-01-06T00:00:00Z'),
      };
      const output: Output = [
        {
          status: OrderStatusEnum.PAID,
          orders: [order1, order2],
        },
        {
          status: OrderStatusEnum.PREPARING,
          orders: [order3, order4],
        },
        {
          status: OrderStatusEnum.READY,
          orders: [order5, order6],
        },
      ];
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute();

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith();
      expect(response).toHaveLength(3);
      expect(response).toEqual(output);
    });
  });
});
