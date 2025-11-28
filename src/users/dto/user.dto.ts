import { Expose, Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateProfileDto } from './profile.dto';
import { UpdateProfileDto } from './profile.dto';
import { OmitType, PartialType, ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/profiles/entities/profile.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The email address of the user' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'The profile information of the user', type: () => Profile })
  @Expose()
  @Transform(({ obj }) => ({
    name: obj.profile?.name,
    last_name: obj.profile?.last_name,
    avatar: obj.profile?.avatar,
  }))
  profile: { name: string; last_name: string; avatar?: string };
}

export class CreateUserDto {
  @ApiProperty({ description: 'The email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the user account' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The profile information of the user' })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['profile', 'password'])) {
  @ApiProperty({ description: 'The profile information of the user', required: false })
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile: UpdateProfileDto;
}
