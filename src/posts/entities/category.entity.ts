import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'categories',
})
export class Category {
  @ApiProperty({ example: 1, description: 'The unique identifier of the category' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Technology', description: 'The name of the category' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({ example: 'All about the latest tech trends', description: 'The description of the category' })
  @Column({ type: 'varchar', length: 800, nullable: true })
  description: string;

  @ApiProperty({ example: 'https://example.com/cover-image.jpg', description: 'The cover image URL of the category' })
  @Column({ type: 'varchar', length: 800, nullable: true })
  cover: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The date and time when the category was created' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty({ example: '2023-01-02T00:00:00Z', description: 'The date and time when the category was last updated' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @ApiProperty({ description: 'The posts associated with the category', type: () => [Post] })
  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
