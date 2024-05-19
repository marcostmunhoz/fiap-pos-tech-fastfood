import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

const defaultUuidOptions: ApiPropertyOptions = {
  example: '053b636d-aaa3-4700-9ead-fe9cfd20507f',
};

export const UuidProperty = (
  options: ApiPropertyOptions = defaultUuidOptions,
) => ApiProperty(options);
