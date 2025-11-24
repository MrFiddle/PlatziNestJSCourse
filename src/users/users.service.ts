import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (user.id === 1) {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
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

  async update(id: number, userData: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, userData);
    return this.userRepository.save(updatedUser);
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { deleted: true };
  }

  private async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
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
