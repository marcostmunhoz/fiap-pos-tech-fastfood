import { Module } from '@nestjs/common';
import { EntityIdGeneratorHelperToken } from './tokens';
import { UuidV4EntityIdGeneratorHelper } from './infrastructure/helper/uuid-v4-entity-id-generator.helper';

@Module({
  providers: [
    {
      provide: EntityIdGeneratorHelperToken,
      useClass: UuidV4EntityIdGeneratorHelper,
    },
  ],
  exports: [EntityIdGeneratorHelperToken],
})
export class SharedModule {}
