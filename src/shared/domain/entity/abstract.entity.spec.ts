import { AbstractEntity } from './abstract.entity';

class TestEntity extends AbstractEntity<any> {}

describe('AbstractEntity', () => {
  describe('constructor', () => {
    it('should create an instance of the entity', () => {
      // Arrange
      const props = {
        id: 'entity-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      const entity = new TestEntity(props);

      // Assert
      expect(entity).toBeInstanceOf(TestEntity);
      expect(entity.id).toEqual(props.id);
      expect(entity.createdAt).toEqual(props.createdAt);
      expect(entity.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('markAsUpdated', () => {
    it('should update the updatedAt property', () => {
      // Arrange
      const props = {
        id: 'entity-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const entity = new TestEntity(props);
      const newDate = new Date();
      newDate.setMinutes(newDate.getMinutes() + 1);
      const spy = jest.spyOn(global, 'Date').mockImplementation(() => newDate);

      // Act
      (entity as any).markAsUpdated();

      // Assert
      expect(spy).toHaveBeenCalled();
      expect(entity.updatedAt).toEqual(newDate);
    });
  });
});
