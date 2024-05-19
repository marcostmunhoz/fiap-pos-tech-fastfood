import { ArgumentMetadata, Optional, PipeTransform } from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';

export type TransformationOptions = ClassTransformOptions;

export type TransformationPipeOptions = {
  validatorOptions?: TransformationOptions;
};

export class TransformationPipe implements PipeTransform<any> {
  protected transformationOptions: TransformationOptions;

  constructor(@Optional() options?: TransformationPipeOptions) {
    options = options || {};

    this.transformationOptions =
      options.validatorOptions || this.getDefaultTransformationOptions();
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (this.shouldTransformToPrimitive(metadata)) {
      return this.transformPrimitive(value, metadata);
    }

    const { metatype } = metadata;

    if (!this.shouldTransformDecorator(metadata)) {
      return value;
    }

    return plainToClass(metatype, value, this.transformationOptions);
  }

  protected getDefaultTransformationOptions(): TransformationOptions {
    return {
      enableImplicitConversion: false,
      exposeDefaultValues: true,
    };
  }

  protected shouldTransformToPrimitive(metadata: ArgumentMetadata): boolean {
    const { type, data } = metadata;

    // If data was not provided (e.g., @Param()), then the pipe should not
    // cat to primitive implicitly, as we assume that the type is an object
    // with properties that should be transformed
    if (!data) {
      return false;
    }

    return 'query' === type || 'param' === type;
  }

  protected transformPrimitive(value: any, metadata: ArgumentMetadata): any {
    const { metatype } = metadata;

    if (Boolean === metatype) {
      return this.isUndefined(value)
        ? undefined
        : true === value || 'true' === value;
    }

    if (Number === metatype) {
      return +value;
    }

    return value;
  }

  protected shouldTransformDecorator(metadata: ArgumentMetadata): boolean {
    const { metatype, data, type } = metadata;

    if ('custom' === type) {
      return false;
    }

    // If data was provided (e.g., @Body('id')), then the pipe should not
    // apply transformations, because we can not use the PropertyDecorators
    // there
    if (data) {
      return false;
    }

    return !!metatype;
  }

  private isUndefined(obj: any): obj is undefined {
    return typeof obj === 'undefined';
  }
}
