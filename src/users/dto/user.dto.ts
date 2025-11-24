import { Expose, Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateProfileDto } from './profile.dto';
import { UpdateProfileDto } from './profile.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => ({
    name: obj.profile?.name,
    last_name: obj.profile?.last_name,
    avatar: obj.profile?.avatar,
  }))
  profile: { name: string; last_name: string; avatar?: string };
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
