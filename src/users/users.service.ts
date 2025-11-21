import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  ];

  findAll(): User[] {
    return this.users;
  }

  getUserById(id: number): User {
    const position = this.findOne(id);
    const user = this.users[position];
    if (user.id === 1) {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  create(userData: CreateUserDto): User {
    const newUser: User = {
      ...userData,
      id: new Date().getTime(),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userData: UpdateUserDto): User | undefined {
    const position = this.findOne(id);
    const user = this.users[position];
    if (user) {
      Object.assign(user, userData);
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  delete(id: number): { deleted: boolean } {
    const position = this.findOne(id);
    this.users.splice(position, 1);
    return { deleted: true };
  }

  private findOne(id: number): number {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return position;
  }
}
