import { Module } from '@nestjs/common';
import { CustomerRepositoryToken } from './application/tokens';
import { TypeOrmCustomerRepository } from './infrastructure/repository/type-orm-customer.repository';
import { FindCustomerByCpfController } from './interface/controller/find-customer-by-cpf.controller';
import { CreateCustomerController } from './interface/controller/create-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/entity/customer.entity';
import { FindCustomerByCpfUseCase } from './application/use-case/find-customer-by-cpf.use-case';
import { CreateCustomerUseCase } from './application/use-case/create-customer.use-case';
import { SharedModule } from '@/shared/shared.module';

const useCases = [FindCustomerByCpfUseCase, CreateCustomerUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), SharedModule],
  providers: [
    {
      provide: CustomerRepositoryToken,
      useClass: TypeOrmCustomerRepository,
    },
    ...useCases,
  ],
  controllers: [FindCustomerByCpfController, CreateCustomerController],
})
export class CustomerModule {}
