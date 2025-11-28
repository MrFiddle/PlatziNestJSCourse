import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AnyShort } from 'src/general_dtos/AnyShort';
import { ShortPostResponseDto } from 'src/posts/dto/short-post-response.dto';
import { Profile } from 'src/profiles/entities/profile.entity';
import { User } from './entities/user.entity';
import { Public } from 'src/common/decorators';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: UserResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Retrieve all users' })
  @Get()
  getUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Public()
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Email already in use' })
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  createUser(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(Number(id));
  }

  @ApiResponse({ status: 200, description: 'Posts retrieved successfully', type: ShortPostResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiOperation({ summary: 'Retrieve posts by user ID' })
  @Get(':id/posts')
  getPostsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getPostsByUserId(Number(id));
  }

  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Email already in use' })
  @ApiOperation({ summary: 'Update a user by ID' })
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData);
  }

  @ApiResponse({ status: 200, description: 'User deleted successfully', schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Delete a user by ID' })
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.usersService.delete(Number(id));
  }

  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Retrieve a user by email' })
  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: Profile })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiOperation({ summary: 'Retrieve profile by user ID' })
  @Get(':id/profile')
  getProfileByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfileByUserId(Number(id));
  }

  @ApiResponse({ status: 200, description: 'Short profile retrieved successfully', type: AnyShort })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiOperation({ summary: 'Retrieve short profile by user ID' })
  @Get(':id/short-profile')
  getShortProfileByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getShortProfileByUserId(Number(id));
  }
}
