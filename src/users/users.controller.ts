import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(Number(id));
  }

  @Get(':id/posts')
  getPostsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getPostsByUserId(Number(id));
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.usersService.delete(Number(id));
  }

  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get(':id/profile')
  getProfileByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfileByUserId(Number(id));
  }

  @Get(':id/short-profile')
  getShortProfileByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getShortProfileByUserId(Number(id));
  }
}
