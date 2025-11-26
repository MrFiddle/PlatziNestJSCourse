import { Expose, Type } from 'class-transformer';
import { AnyShort } from 'src/general_dtos/AnyShort';
import { UserResponseDto } from 'src/users/dto/user.dto';

export class ShortPostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  summary: string;

  @Expose()
  is_draft: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => AnyShort)
  categories: AnyShort[];
}
