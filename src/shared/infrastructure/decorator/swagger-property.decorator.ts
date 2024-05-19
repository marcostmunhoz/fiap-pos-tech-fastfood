import {
  ApiParam,
  ApiParamOptions,
  ApiProperty,
  ApiPropertyOptions,
} from '@nestjs/swagger';

const defaultUuidPropertyOptions: ApiPropertyOptions = {
  example: '053b636d-aaa3-4700-9ead-fe9cfd20507f',
};

export const UuidProperty = (
  options: ApiPropertyOptions = defaultUuidPropertyOptions,
) => ApiProperty(options);

export const UuidParam = (options: ApiParamOptions) => {
  return ApiParam({
    example: '053b636d-aaa3-4700-9ead-fe9cfd20507f',
    ...options,
  });
};
