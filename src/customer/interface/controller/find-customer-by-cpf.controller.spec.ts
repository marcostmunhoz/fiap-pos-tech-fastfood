import {
  FindCustomerByCpfUseCase,
  Output,
} from '@/customer/application/use-case/find-customer-by-cpf.use-case';
import {
  getValidCpf,
  getValidCustomerEntityId,
  getValidFullName,
} from '@/testing/customer/helpers';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FindCustomerByCpfPathParam } from '../dto/find-customer-by-cpf.request';
import { FindCustomerByCpfController } from './find-customer-by-cpf.controller';

describe('FindCustomerByCpfController', () => {
  let useCaseMock: jest.Mocked<FindCustomerByCpfUseCase>;
  let controller: FindCustomerByCpfController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindCustomerByCpfUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FindCustomerByCpfUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [FindCustomerByCpfController],
    }).compile();

    controller = module.get<FindCustomerByCpfController>(
      FindCustomerByCpfController,
    );
  });

  describe('execute', () => {
    it('should return the existing customer', async () => {
      // Arrange
      const param: FindCustomerByCpfPathParam = {
        cpf: getValidCpf(),
      };
      const output: Output = {
        id: getValidCustomerEntityId(),
        name: getValidFullName(),
      };
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(param);

      // Assert
      expect(response).toEqual({
        id: output.id.value,
        name: output.name.value,
      });
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      // Arrange
      const param: FindCustomerByCpfPathParam = {
        cpf: getValidCpf(),
      };
      useCaseMock.execute.mockResolvedValue(null);

      // Act
      const execute = () => controller.execute(param);

      // Assert
      expect(execute()).rejects.toThrow(NotFoundException);
    });
  });
});
