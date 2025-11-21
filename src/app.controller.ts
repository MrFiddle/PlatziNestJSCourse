import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Env } from './env.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<Env>,
  ) {}

  @Get()
  getHello() {
    return this.usersService.findAll();
  }

  @Get('config')
  getConfig() {
    const myEnvVariable = this.configService.get('MY_ENV_VARIABLE', { infer: true });
    const message = this.appService.getHello();
    return {
      message,
      myEnvVariable,
    };
  }
}
