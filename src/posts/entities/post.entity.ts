import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({
  name: 'posts',
}) // Marks this as a database table
export class Post {
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Title of the blog post
  title: string;

  @Column({ type: 'text', nullable: true }) // Content of the blog post
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Optional cover image URL
  cover: string;

  @Column({ type: 'varchar', length: 500, nullable: true }) // Optional brief
  summary: string;

  @Column({ type: 'boolean', default: true }) // Publication status
  is_draft: boolean;

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

  // @ManyToOne(() => User, { nullable: false })
  // @JoinColumn({ name: 'author_id' })
  // author: User;
}
