import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the response is an error' })
  error: boolean;

  @ApiPropertyOptional({ description: 'Optional message describing the response' })
  msg?: string;

  @ApiPropertyOptional({ description: 'Optional response data' })
  data?: T;

  constructor(
    error: boolean,
    msg?: string,
    data?: T,
  ) {
    this.error = error;
    this.msg = msg;
    this.data = data;
  }
}
