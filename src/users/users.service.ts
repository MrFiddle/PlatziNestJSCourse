import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { AnyShort } from 'src/general_dtos/AnyShort';
import { Post } from 'src/posts/entities/post.entity';
import { ShortPostResponseDto } from 'src/posts/dto/short-post-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['profile'],
    });
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async getProfileByUserId(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user.profile;
  }

  async getShortProfileByUserId(id: number): Promise<AnyShort> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const profile = user.profile;
    const response: AnyShort = { id: profile.id, name: profile.name };
    return response;
  }

  async getPostsByUserId(id: number): Promise<ShortPostResponseDto[]> {
    // First, check if the user exists
    await this.getUserById(id); // This will throw if user not found

    const posts = await this.postRepository.find({
      where: { user: { id } },
      relations: ['user.profile'],
    });

    return plainToInstance(ShortPostResponseDto, posts, { excludeExtraneousValues: true });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.findOneByEmail(email);
    return user;
  }

  async create(userData: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (await this.userRepository.findOneBy({ email: userData.email })) {
      throw new ForbiddenException('Email already in use');
    }

    try {
      const newUser = await queryRunner.manager.save(User, userData);
      await queryRunner.commitTransaction();
      const { password, ...result } = newUser;
      return result as User;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create user');
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, userData: UpdateUserDto) {
    if (userData.email && (await this.userRepository.findOneBy({ email: userData.email }))) {
      throw new ForbiddenException('Email already in use');
    }
    try {
      const user = await this.findOne(id);
      const updatedUser = this.userRepository.merge(user, userData);
      const savedUser = await this.userRepository.save(updatedUser);
      return savedUser;
    } catch {
      throw new BadRequestException('Failed to update user');
    }
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    try {
      await this.userRepository.delete(id);
      return { deleted: true };
    } catch {
      throw new BadRequestException('Failed to delete user');
    }
  }

  private async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  private async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
