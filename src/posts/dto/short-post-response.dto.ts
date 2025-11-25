import { Expose } from 'class-transformer';

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
}
