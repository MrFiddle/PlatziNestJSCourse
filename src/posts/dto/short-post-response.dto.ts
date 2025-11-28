import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AnyShort } from 'src/general_dtos/AnyShort';
import { UserResponseDto } from 'src/users/dto/user.dto';

export class ShortPostResponseDto {
  @ApiProperty({ description: 'The unique identifier of the post' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The title of the post' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'The summary of the post' })
  @Expose()
  summary: string;

  @ApiProperty({ description: 'Indicates if the post is a draft' })
  @Expose()
  is_draft: boolean;

  @ApiProperty({ description: 'The creation date of the post' })
  @Expose()
  created_at: Date;

  @ApiProperty({ description: 'The user who created the post' })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ description: 'The categories associated with the post' })
  @Expose()
  @Type(() => AnyShort)
  categories: AnyShort[];
}
