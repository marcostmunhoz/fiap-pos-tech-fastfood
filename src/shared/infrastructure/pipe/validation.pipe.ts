import { ArgumentMetadata, Optional, PipeTransform } from '@nestjs/common';
import {
  ValidationError,
  ValidatorOptions as ClassValidatorOptions,
  validate,
} from 'class-validator';
import { iterate } from 'iterare';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

export type ValidatorOptions = ClassValidatorOptions;

export type ValidationPipeOptions = {
  validatorOptions?: ValidatorOptions;

  /**
   * @default 422
   */
  httpErrorStatusCode?: number;
};

export class ValidationPipe implements PipeTransform<any> {
  protected validatorOptions: ValidatorOptions;
  protected errorHttpStatusCode: number;

  constructor(@Optional() options?: ValidationPipeOptions) {
    options = options || {};

    this.validatorOptions =
      options.validatorOptions || this.getDefaultValidatorOptions();
    this.errorHttpStatusCode =
      options.httpErrorStatusCode || this.getDefaultHttpErrorStatusCode();
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!this.shouldValidate(metadata)) {
      return value;
    }

    const { metatype } = metadata;
    const valueMappedToMetatype = {
      ...value,
      constructor: metatype,
    };

    const errors = await validate(valueMappedToMetatype, this.validatorOptions);

    if (errors.length > 0) {
      this.throwValidationException(errors);
    }

    return value;
  }

  protected getDefaultValidatorOptions(): ValidatorOptions {
    return {
      enableDebugMessages: false,
      skipUndefinedProperties: false,
      skipNullProperties: false,
      skipMissingProperties: false,
      whitelist: false,
      stopAtFirstError: false,
      forbidUnknownValues: true,
      forbidNonWhitelisted: false,
    };
  }

  protected getDefaultHttpErrorStatusCode(): number {
    return 422;
  }

  protected shouldValidateDecorator(metadata: ArgumentMetadata): boolean {
    return 'custom' !== metadata.type;
  }

  protected shouldValidate(metadata: ArgumentMetadata): boolean {
    const { metatype, data, type } = metadata;

    if ('custom' === type) {
      return false;
    }

    // If data was provided (e.g., @Body('id')), then the pipe should not apply validations
    // because we can not use the PropertyDecorators there
    if (data) {
      return true;
    }

    if (!metatype) {
      return false;
    }

    const types = [String, Boolean, Number, Array, Object, Buffer, Date];

    return !types.some((type) => type === metatype);
  }

  protected throwValidationException(errors: ValidationError[] = []): never {
    const flattened = iterate(errors)
      .map((error) => this.mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray();

    throw new HttpErrorByCode[this.errorHttpStatusCode](flattened);
  }

  protected mapChildrenToValidationErrors(
    error: ValidationError,
    parent?: string,
  ): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }

    const validationErrors = [];

    parent = parent ? `${parent}.${error.property}` : error.property;

    for (const item of error.children) {
      if (item.children && item.children.length) {
        validationErrors.push(
          ...this.mapChildrenToValidationErrors(item, parent),
        );
      }

      validationErrors.push(
        this.prependConstraintsWithParentProp(parent, item),
      );
    }

    return validationErrors;
  }

  protected prependConstraintsWithParentProp(
    parent: string,
    error: ValidationError,
  ): ValidationError {
    const constraints = {};
    for (const key in error.constraints) {
      constraints[key] = `${parent}.${error.constraints[key]}`;
    }
    return {
      ...error,
      constraints,
    };
  }
}
