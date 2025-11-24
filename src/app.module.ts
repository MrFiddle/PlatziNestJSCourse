import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './env.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Env>) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST', { infer: true }),
        port: configService.get('MYSQL_PORT', { infer: true }),
        username: configService.get('MYSQL_USER', { infer: true }),
        password: configService.get('MYSQL_PASSWORD', { infer: true }),
        database: configService.get('MYSQL_DB', { infer: true }),
        autoLoadEntities: true,
        synchronize: true, // Note: set to false in production
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AppModule {}
