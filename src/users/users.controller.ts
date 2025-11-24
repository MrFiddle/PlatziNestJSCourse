import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(Number(id));
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userData: Omit<UpdateUserDto, 'id'>): Promise<User> {
    return this.usersService.update(Number(id), userData);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.usersService.delete(Number(id));
  }

  @Get('email/:email')
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }
}
