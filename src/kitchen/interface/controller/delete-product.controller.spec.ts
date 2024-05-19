import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductController } from './delete-product.controller';
import {
  DeleteProductUseCase,
  Output,
} from '@/kitchen/application/use-case/delete-product.use-case';
import { getDomainProductEntityPropsWithId } from '@/testing/shared/helpers';

describe('DeleteProductController', () => {
  let useCaseMock: jest.Mocked<DeleteProductUseCase>;
  let controller: DeleteProductController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteProductUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteProductUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [DeleteProductController],
    }).compile();

    controller = module.get<DeleteProductController>(DeleteProductController);
  });

  describe('execute', () => {
    it('should delete an existing product', async () => {
      // Arrange
      const props = getDomainProductEntityPropsWithId();
      const { id } = props;

      // Act
      await controller.execute({ id });

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({ id });
    });
  });
});
