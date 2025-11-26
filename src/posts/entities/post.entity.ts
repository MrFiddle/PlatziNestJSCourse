import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';

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

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
