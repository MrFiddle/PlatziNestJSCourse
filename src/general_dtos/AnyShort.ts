import { Expose } from 'class-transformer';

export class AnyShort {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
