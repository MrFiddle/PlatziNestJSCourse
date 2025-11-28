import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ForeignKey } from 'typeorm';

@Entity({
  name: 'profiles',
}) // Marks this as a database table
export class Profile {
  @ApiProperty({ example: 1, description: 'The unique identifier of the profile' })
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @Column({ type: 'varchar', length: 255 }) // Specifies column type and constraints
  name: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @Column({ type: 'varchar', length: 255 }) // Specifies column type and constraints
  last_name: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'The avatar URL of the user' })
  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The date and time when the profile was created' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  }) // Auto-sets creation time
  created_at: Date;

  @ApiProperty({ example: '2023-01-02T00:00:00Z', description: 'The date and time when the profile was last updated' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  }) // Auto-updates on modification
  updated_at: Date;

  // @ForeignKey(() => User)
  // userId: number;
}
