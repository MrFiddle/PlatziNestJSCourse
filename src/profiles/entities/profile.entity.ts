import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ForeignKey } from 'typeorm';

@Entity({
  name: 'profiles',
}) // Marks this as a database table
export class Profile {
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Specifies column type and constraints
  name: string;

  @Column({ type: 'varchar', length: 255 }) // Specifies column type and constraints
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  }) // Auto-sets creation time
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  }) // Auto-updates on modification
  updated_at: Date;

  // @ForeignKey(() => User)
  // userId: number;
}
