import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'posts',
}) // Marks this as a database table
export class Post {
  @ApiProperty({ example: 1, description: 'The unique identifier of the post' })
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @ApiProperty({ example: 'My First Blog Post', description: 'The title of the blog post' })
  @Column({ type: 'varchar', length: 255 }) // Title of the blog post
  title: string;

  @ApiProperty({ example: 'This is the content of my first blog post.', description: 'The content of the blog post' })
  @Column({ type: 'text', nullable: true }) // Content of the blog post
  content: string;

  @ApiProperty({ example: 'https://example.com/cover-image.jpg', description: 'The cover image URL of the blog post' })
  @Column({ type: 'varchar', length: 900, nullable: true }) // Optional cover image URL
  cover: string;

  @ApiProperty({ example: 'A brief summary of the blog post', description: 'A brief summary of the blog post' })
  @Column({ type: 'varchar', length: 500, nullable: true }) // Optional brief
  summary: string;

  @ApiProperty({ example: true, description: 'Publication status of the blog post' })
  @Column({ type: 'boolean', default: true }) // Publication status
  is_draft: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The date and time when the post was created' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  }) // Auto-sets creation time
  created_at: Date;

  @ApiProperty({ example: '2023-01-02T00:00:00Z', description: 'The date and time when the post was last updated' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  }) // Auto-updates on modification
  updated_at: Date;

  @ApiProperty({ description: 'The categories associated with the post', type: () => [Category] })
  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ApiProperty({ description: 'The user who created the post', type: () => User })
  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
