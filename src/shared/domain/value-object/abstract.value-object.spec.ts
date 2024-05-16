import { AbstractValueObject } from './abstract.value-object';

type ConcreteValueObjectProps = {
  id: number;
  name: string;
};

class ConcreteValueObject extends AbstractValueObject<ConcreteValueObjectProps> {
  constructor(props: ConcreteValueObjectProps) {
    super(props);
  }
}

describe('AbstractValueObject', () => {
  describe('equals', () => {
    it('should return true when comparing two value objects with the same props', () => {
      // Arrange
      const props = { id: 1, name: 'John' };
      const valueObject1 = new ConcreteValueObject(props);
      const valueObject2 = new ConcreteValueObject(props);

      // Act
      const result = valueObject1.equals(valueObject2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when comparing two value objects with different props', () => {
      // Arrange
      const props1 = { id: 1, name: 'John' };
      const props2 = { id: 2, name: 'Jane' };
      const valueObject1 = new ConcreteValueObject(props1);
      const valueObject2 = new ConcreteValueObject(props2);

      // Act
      const result = valueObject1.equals(valueObject2);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when comparing a value object with null', () => {
      // Arrange
      const props = { id: 1, name: 'John' };
      const valueObject = new ConcreteValueObject(props);

      // Act
      const result = valueObject.equals(null);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when comparing a value object with undefined', () => {
      // Arrange
      const props = { id: 1, name: 'John' };
      const valueObject = new ConcreteValueObject(props);

      // Act
      const result = valueObject.equals(undefined);

      // Assert
      expect(result).toBe(false);
    });
  });
});
