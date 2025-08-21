import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PopulationHistoryDto } from './population_history.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CountryInfoDto {
  @ApiProperty({
    type: [String],
    description: 'List of border country codes',
    example: [
      {
        "commonName": "Canada",
        "officialName": "Canada",
        "countryCode": "CA",
        "region": "Americas"
      },
      {
        "commonName": "Mexico",
        "officialName": "United Mexican States",
        "countryCode": "MX",
        "region": "Americas"
      }
    ],
  })
  @IsArray()
  borders: string[];

  @ApiPropertyOptional({
    type: [PopulationHistoryDto],
    description: 'Population history records',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PopulationHistoryDto)
  populationHistory?: PopulationHistoryDto[];

  @ApiPropertyOptional({
    type: String,
    description: 'URL of the country flag',
    example: '"https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg',
  })
  @IsOptional()
  @IsString()
  flagUrl?: string;
}
