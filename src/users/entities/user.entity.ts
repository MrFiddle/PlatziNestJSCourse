import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';

@Entity({
  name: 'users',
}) // Marks this as a database table
export class User {
  @PrimaryGeneratedColumn() // Auto-increments ID as primary key
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true }) // Ensures unique emails
  email: string;

  @Column({ type: 'varchar', length: 255 }) // Excludes password from queries by default
  @Exclude()
  password: string;

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

  @OneToOne(() => Profile, { nullable: false, cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
