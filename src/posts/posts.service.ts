import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ShortPostResponseDto } from './dto/short-post-response.dto';
import { UserResponseDto } from 'src/users/dto/user.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private dataSource: DataSource,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPost = await queryRunner.manager.save(Post, {
        ...createPostDto,
        user: { id: createPostDto.user_id },
      });
      await queryRunner.commitTransaction();
      const post = await this.findOne(newPost.id);
      return {
        ...post,
        user: plainToInstance(UserResponseDto, post.user, { excludeExtraneousValues: true }),
      };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create post');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['user.profile'],
    });
    return plainToInstance(ShortPostResponseDto, posts, { excludeExtraneousValues: true });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user.profile'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findOne(id);
      const updatedPost = this.postRepository.merge(post, updatePostDto);
      const savedPost = await this.postRepository.save(updatedPost);
      return savedPost;
    } catch {
      throw new BadRequestException('Failed to update post');
    }
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    try {
      const result = await this.postRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete post');
    }
  }
}
