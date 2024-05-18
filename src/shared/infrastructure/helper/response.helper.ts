import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

export function mapObjectToResponse<TObject, TResponse>(
  outputClass: ClassConstructor<TResponse>,
  plain: TObject,
  options?: ClassTransformOptions,
): TResponse {
  const defaultOptions: ClassTransformOptions = {
    excludeExtraneousValues: true,
    exposeUnsetFields: true,
  };

  return plainToInstance(
    outputClass,
    plain,
    Object.assign(defaultOptions, options),
  );
}
