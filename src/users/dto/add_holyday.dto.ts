import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddHolidaysDto {
  @ApiProperty({ description: 'ISO country code', example: 'US' })
  @IsString()
  countryCode: string;

  @ApiProperty({ description: 'Year for holidays', example: 2025 })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({ description: 'Optional list of specific holidays to add', example: ["New Year's Day", 'Independence Day'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays?: string[];
}
