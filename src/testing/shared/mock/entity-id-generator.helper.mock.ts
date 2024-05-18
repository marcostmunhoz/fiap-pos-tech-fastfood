import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';

export const getEntityIdGeneratorHelperMock =
  (): jest.Mocked<EntityIdGeneratorHelper> => ({
    generate: jest.fn(),
  });
