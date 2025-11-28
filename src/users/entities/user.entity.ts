import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';

@Entity({
  name: 'users',
}) // Marks this as a database table
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'The email address of the user' })
  @Column({ type: 'varchar', length: 255, unique: true }) // Ensures unique emails
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
  @Column({ type: 'varchar', length: 255 }) // Excludes password from queries by default
  @Exclude()
  password: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The date and time when the user was created' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  }) // Auto-sets creation time
  created_at: Date;

  @ApiProperty({ example: '2023-01-02T00:00:00Z', description: 'The date and time when the user was last updated' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  }) // Auto-updates on modification
  updated_at: Date;

  @ApiProperty({ description: 'The profile associated with the user' })
  @OneToOne(() => Profile, { nullable: false, cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ApiProperty({ description: 'The posts created by the user', type: () => [Post] })
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
