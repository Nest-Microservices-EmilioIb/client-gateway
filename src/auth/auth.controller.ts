import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async registerUser(@Body() regiserUserDto: RegisterUserDto) {
    try {
      return await firstValueFrom(
        this.client.send('auth.register.user', regiserUserDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      return await firstValueFrom(
        this.client.send('auth.login.user', loginUserDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken(@User() user: CurrentUser, @Token() token: string) {
    try {
      // const user = req['user'];
      // const token = req['token'];
      return { user, token };
      return await firstValueFrom(this.client.send('auth.verify.token', {}));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
