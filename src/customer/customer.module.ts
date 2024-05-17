import { Module } from '@nestjs/common';
import { CustomerRepositoryToken } from './application/tokens';
import { TypeOrmCustomerRepository } from './infrastructure/repository/type-orm-customer.repository';

@Module({
  providers: [
    {
      provide: CustomerRepositoryToken,
      useClass: TypeOrmCustomerRepository,
    },
  ],
})
export class CustomerModule {}
