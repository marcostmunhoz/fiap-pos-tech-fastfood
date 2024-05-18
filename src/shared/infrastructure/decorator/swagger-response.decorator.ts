import { ApiProperty, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

class BadRequestResponse {
  @ApiProperty({
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    example: 400,
  })
  statusCode: number;
}

class UnprocessableEntityResponse {
  @ApiProperty({
    type: [String],
    example: ['name should not be empty', 'email should not be empty'],
  })
  message: string[];

  @ApiProperty({
    example: 'Unprocessable Entity',
  })
  error: string = 'Unprocessable Entity';

  @ApiProperty({
    example: 422,
  })
  statusCode: number;
}

class InternalServerErrorResponse {
  @ApiProperty({
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    example: 500,
  })
  statusCode: number;
}

class NotFoundResponse {
  @ApiProperty({
    example: 'Not Found',
  })
  message: string;

  @ApiProperty({
    example: 404,
  })
  statusCode: number;
}

const defaultBadRequestOptions: ApiResponseOptions = {
  status: 400,
  description: 'Bad Request',
  type: BadRequestResponse,
};

const defaultUnprocessableEntityOptions: ApiResponseOptions = {
  status: 422,
  description: 'Unprocessable Entity',
  type: UnprocessableEntityResponse,
};

const defaultInternalServerErrorOptions: ApiResponseOptions = {
  status: 500,
  description: 'Internal Server Error',
  type: InternalServerErrorResponse,
};

const defaultNotFoundOptions: ApiResponseOptions = {
  status: 404,
  description: 'Not Found',
  type: NotFoundResponse,
};

export const DefaultBadRequestResponse = (
  options: ApiResponseOptions = defaultBadRequestOptions,
) => ApiResponse(options);

export const DefaultUnprocessableEntityResponse = (
  options: ApiResponseOptions = defaultUnprocessableEntityOptions,
) => ApiResponse(options);

export const DefaultInternalServerErrorResponse = (
  options: ApiResponseOptions = defaultInternalServerErrorOptions,
) => ApiResponse(options);

export const DefaultNotFoundResponse = (
  options: ApiResponseOptions = defaultNotFoundOptions,
) => ApiResponse(options);
