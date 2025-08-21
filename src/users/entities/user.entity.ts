import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  // Marks 'id' as a required property in Swagger docs, describes it, and sets its format as UUID
  @ApiProperty({ description: 'User unique ID', type: 'string', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Marks 'name' as a required property in Swagger docs, describes it, and provides an example
  @ApiProperty({ description: 'User name', type: 'string', example: 'John Doe' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  // Marks 'calendar' as an optional property in Swagger docs, describes it, and provides an example
  @ApiPropertyOptional({
    description: 'User calendar events',
    type: 'array',
    example: [
      { name: "New Year's Day", date: '2025-01-01' },
      { name: 'Independence Day', date: '2025-07-04' }
    ]
  })
  @Column('jsonb', { nullable: true })
  calendar?: { name: string; date: string }[];
}
