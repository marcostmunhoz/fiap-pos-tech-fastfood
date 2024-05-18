import { DomainExceptionFilter } from './domain-exception.filter';

describe('InvalidValueExceptionFilter', () => {
  it('should be defined', () => {
    expect(new DomainExceptionFilter()).toBeDefined();
  });
});
