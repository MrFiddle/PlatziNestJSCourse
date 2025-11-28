import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The content of the post', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'The cover image URL of the post', required: false })
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiProperty({ description: 'The summary of the post', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'The category IDs associated with the post', type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  category_ids?: number[];
}
