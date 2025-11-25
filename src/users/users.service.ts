import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { AnyShort } from 'src/interfaces/AnyShort';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['profile'],
    });
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.findOneByEmail(email);
    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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
    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, userData);
    const savedUser = await this.userRepository.save(updatedUser);
    return savedUser;
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { deleted: true };
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
