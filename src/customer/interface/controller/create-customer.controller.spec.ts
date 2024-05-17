import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerController } from './create-customer.controller';
import {
  CreateCustomerUseCase,
  Input,
  Output,
} from '@/customer/application/use-case/create-customer.use-case';
import {
  getDomainCustomerEntityPropsWithId,
  getValidCpf,
  getValidEmail,
  getValidFullName,
} from '@/testing/customer/helpers';
import { CreateCustomerRequest } from '../dto/create-customer.request';

describe('CreateCustomerController', () => {
  let useCaseMock: jest.Mocked<CreateCustomerUseCase>;
  let controller: CreateCustomerController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateCustomerUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateCustomerUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [CreateCustomerController],
    }).compile();

    controller = module.get<CreateCustomerController>(CreateCustomerController);
  });

  describe('execute', () => {
    it('should return the created customer', async () => {
      // Arrange
      const request: CreateCustomerRequest = {
        name: getValidFullName(),
        email: getValidEmail(),
        cpf: getValidCpf(),
      };
      const output: Output = getDomainCustomerEntityPropsWithId();
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(request);

      // Assert
      expect(response).toEqual({
        id: output.id.value,
        name: output.name.value,
      });
    });
  });
});
