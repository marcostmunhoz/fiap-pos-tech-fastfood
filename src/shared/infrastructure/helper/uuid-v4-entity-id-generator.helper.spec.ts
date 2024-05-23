import * as uuid from 'uuid';
import { UuidV4EntityIdGeneratorHelper } from './uuid-v4-entity-id-generator.helper';

jest.mock('uuid');

describe('EntityIdGeneratorHelper', () => {
  let sut: UuidV4EntityIdGeneratorHelper;

  beforeEach(() => {
    jest.mock('uuid');

    sut = new UuidV4EntityIdGeneratorHelper();
  });

  describe('generate', () => {
    it('should return a new EntityIdValueObject', () => {
      // Arrange
      const spy = jest.spyOn(uuid, 'v4').mockReturnValue('v4-uuid');

      // Act
      const result = sut.generate();

      // Assert
      expect(spy).toHaveBeenCalled();
      expect(result.value).toEqual('v4-uuid');
    });
  });
});
