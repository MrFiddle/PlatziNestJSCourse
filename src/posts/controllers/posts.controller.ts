import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';
import { type Request } from 'express';
import { type JWTPayload } from 'src/auth/models/payload.model';
import { Post as PostEntity } from '../entities/post.entity';
import { ShortPostResponseDto } from '../dto/short-post-response.dto';
import { PostPublishResponse } from '../models/PublishResponse';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiResponse({ status: 201, description: 'Post created successfully', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const jwtPayload = req.user as JWTPayload;
    return this.postsService.create(createPostDto, jwtPayload);
  }

  @ApiResponse({ status: 200, description: 'Posts retrieved successfully', type: ShortPostResponseDto, isArray: true })
  @ApiOperation({ summary: 'Retrieve all posts' })
  @Public()
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Post retrieved successfully', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiOperation({ summary: 'Retrieve a post by ID' })
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiOperation({ summary: 'Update a post by ID' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiResponse({ status: 200, description: 'Post published successfully', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiOperation({ summary: 'Publish a post by ID' })
  @Put(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const payload = req.user as JWTPayload;
    return this.postsService.publish(id, payload);
  }

  @ApiResponse({ status: 200, description: 'Post deleted successfully', schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiOperation({ summary: 'Delete a post by ID' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
