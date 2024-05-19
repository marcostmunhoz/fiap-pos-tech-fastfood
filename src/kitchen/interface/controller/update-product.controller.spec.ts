import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductController } from './update-product.controller';
import {
  UpdateProductUseCase,
  Output,
} from '@/kitchen/application/use-case/update-product.use-case';
import { getDomainProductEntityPropsWithId } from '@/testing/shared/helpers';

describe('UpdateProductController', () => {
  let useCaseMock: jest.Mocked<UpdateProductUseCase>;
  let controller: UpdateProductController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateProductUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateProductUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [UpdateProductController],
    }).compile();

    controller = module.get<UpdateProductController>(UpdateProductController);
  });

  describe('execute', () => {
    it('should return an existing product', async () => {
      // Arrange
      const props = getDomainProductEntityPropsWithId();
      const { id } = props;

      // Act
      await controller.execute({ id }, props);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({ id, data: props });
    });
  });
});
