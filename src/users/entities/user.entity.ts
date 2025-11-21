import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this as a database table
export class User {
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @Column({ length: 100 }) // Specifies column type and constraints
  name: string;

  @Column({ unique: true }) // Ensures unique emails
  email: string;
}
