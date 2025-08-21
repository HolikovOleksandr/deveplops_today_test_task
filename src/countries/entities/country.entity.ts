import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PopulationHistoryDto } from '../dto/population_history.dto';

@Entity()
export class Country {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Unique identifier for the country.',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
    description: 'ISO country code.',
  })
  @Column()
  countryCode: string;

  @ApiProperty({
    type: [String],
    description: 'List of country codes that border this country.',
  })
  @Column('text', { array: true })
  borders: string[];

  @ApiPropertyOptional({
    type: String,
    description: "URL to the country's flag image.",
    nullable: true,
  })
  @Column({ nullable: true })
  flagUrl?: string;

  @ApiPropertyOptional({
    type: [PopulationHistoryDto],
    description: 'Historical population data for the country.',
    nullable: true,
  })
  @Column('jsonb', { nullable: true })
  populationHistory?: PopulationHistoryDto[];
}
