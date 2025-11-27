import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  category_ids?: number[];
}
