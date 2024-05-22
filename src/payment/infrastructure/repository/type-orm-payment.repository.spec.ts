import { In, Repository } from 'typeorm';
import { TypeOrmPaymentRepository } from './type-orm-payment.repository';
import { PaymentEntity as InfrastructurePaymentEntity } from '../entity/payment.entity';
import { getTypeOrmRepositoryMock } from '@/testing/shared/mock/type-orm.repository.mock';
import {
  getDomainPaymentEntity,
  getInfrastructurePaymentEntity,
} from '@/testing/payment/helpers';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { PaymentEntity as DomainPaymentEntity } from '@/payment/domain/entity/payment.entity';

describe('TypeOrmPaymentRepository', () => {
  let repositoryMock: jest.Mocked<Repository<InfrastructurePaymentEntity>>;
  let sut: TypeOrmPaymentRepository;

  beforeEach(() => {
    const mocks = getTypeOrmRepositoryMock<InfrastructurePaymentEntity>();
    repositoryMock = mocks.repositoryMock;
    sut = new TypeOrmPaymentRepository(repositoryMock);
  });

  describe('existsWithOrderIdAndNotFailed', () => {
    it('should return true when a payment with the provided order ID exists and is not failed', async () => {
      // Arrange
      const dbEntity = getInfrastructurePaymentEntity();
      repositoryMock.exists.mockResolvedValue(true);

      // Act
      const result = await sut.existsWithOrderIdAndNotFailed(dbEntity.orderId);

      // Assert
      expect(repositoryMock.exists).toHaveBeenCalledTimes(1);
      expect(repositoryMock.exists).toHaveBeenCalledWith({
        where: {
          orderId: dbEntity.orderId,
          status: In([PaymentStatusEnum.PENDING, PaymentStatusEnum.PAID]),
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('save', () => {
    it('should create a payment', async () => {
      // Arrange
      const entity = getDomainPaymentEntity();
      const dbEntity = getInfrastructurePaymentEntity();
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.save(entity);

      // Assert
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntity);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainPaymentEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.orderId).toBe(dbEntity.orderId);
      expect(result.total.value).toBe(dbEntity.total);
      expect(result.paymentMethod).toBe(dbEntity.paymentMethod);
      expect(result.status).toBe(dbEntity.status);
      expect(result.externalPaymentId).toBe(dbEntity.externalPaymentId);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });
});
