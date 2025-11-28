import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AnyShort {
  @ApiProperty({ description: 'The unique identifier' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name' })
  @Expose()
  name: string;
}
