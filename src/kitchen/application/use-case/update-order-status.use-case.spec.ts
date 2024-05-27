import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import {
  getDomainOrderEntity,
  getValidOrderEntityId,
} from '@/testing/shared/helpers';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import {
  Input,
  UpdateOrderStatusUseCase,
} from './update-order-status.use-case';

describe('UpdateOrderStatusUseCase', () => {
  let repository: jest.Mocked<OrderRepository>;
  let sut: UpdateOrderStatusUseCase;

  beforeEach(() => {
    repository = getOrderRepositoryMock();
    sut = new UpdateOrderStatusUseCase(repository);
  });

  describe('execute', () => {
    const dataset = [
      [OrderStatusEnum.PAID, OrderStatusEnum.PREPARING, 'markAsPreparing'],
      [OrderStatusEnum.PREPARING, OrderStatusEnum.READY, 'markAsReady'],
      [OrderStatusEnum.READY, OrderStatusEnum.DELIVERED, 'markAsDelivered'],
    ];

    it.each(dataset)(
      'should update the order status',
      async (
        oldStatus: OrderStatusEnum,
        newStatus:
          | OrderStatusEnum.PREPARING
          | OrderStatusEnum.READY
          | OrderStatusEnum.DELIVERED,
        method: 'markAsPreparing' | 'markAsReady' | 'markAsDelivered',
      ) => {
        // Arrange
        const entity = getDomainOrderEntity({
          status: oldStatus,
        });
        const input: Input = {
          id: entity.id,
          data: { status: newStatus },
        };
        repository.findById.mockResolvedValue(entity);
        const entityMethodSpy = jest.spyOn(entity, method);

        // Act
        await sut.execute(input);

        // Assert
        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(entity.id);
        expect(entityMethodSpy).toHaveBeenCalledTimes(1);
        expect(repository.save).toHaveBeenCalledTimes(1);
        expect(repository.save).toHaveBeenCalledWith(entity);
      },
    );

    it('should throw an error when the order does not exist', async () => {
      // Arrange
      const input: Input = {
        id: getValidOrderEntityId(),
        data: { status: OrderStatusEnum.PREPARING },
      };
      repository.findById.mockResolvedValue(null);

      // Act
      const act = () => sut.execute(input);

      // Assert
      await expect(act).rejects.toThrow('Order not found with given ID.');
    });
  });
});
