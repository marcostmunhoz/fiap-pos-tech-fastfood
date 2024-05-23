import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCustomerUseCase } from './application/use-case/create-customer.use-case';
import { FindCustomerByCpfUseCase } from './application/use-case/find-customer-by-cpf.use-case';
import { CustomerFactory } from './domain/factory/customer.factory';
import { CustomerEntity } from './infrastructure/entity/customer.entity';
import { TypeOrmCustomerRepository } from './infrastructure/repository/type-orm-customer.repository';
import { CreateCustomerController } from './interface/controller/create-customer.controller';
import { FindCustomerByCpfController } from './interface/controller/find-customer-by-cpf.controller';
import { CustomerRepositoryToken } from './tokens';

const factories = [CustomerFactory];
const useCases = [FindCustomerByCpfUseCase, CreateCustomerUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), SharedModule],
  providers: [
    {
      provide: CustomerRepositoryToken,
      useClass: TypeOrmCustomerRepository,
    },
    ...factories,
    ...useCases,
  ],
  controllers: [FindCustomerByCpfController, CreateCustomerController],
})
export class CustomerModule {}
