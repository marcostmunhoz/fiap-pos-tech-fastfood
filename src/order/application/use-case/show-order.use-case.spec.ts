import { Output, ShowOrderUseCase } from './show-order.use-case';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import {
  getDomainOrderEntity,
  getValidOrderEntityId,
} from '@/testing/shared/helpers';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';

describe('ShowOrderUseCase', () => {
  let sut: ShowOrderUseCase;
  let repository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    repository = getOrderRepositoryMock();
    sut = new ShowOrderUseCase(repository);
  });

  describe('execute', () => {
    it('should return an existing order', async () => {
      // Arrange
      const entity = getDomainOrderEntity();
      repository.findById.mockResolvedValue(entity);
      const output: Output = {
        items: entity.items,
        total: entity.total,
      };

      // Act
      await sut.execute({ id: entity.id });

      // Assert
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(entity.id);
    });

    it('should throw an error when a order with the given id does not exists', async () => {
      // Arrange
      const id = getValidOrderEntityId();
      repository.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute({ id });

      // Assert
      expect(result).rejects.toThrow(
        new EntityNotFoundException('Order not found with given ID.'),
      );
    });
  });
});
