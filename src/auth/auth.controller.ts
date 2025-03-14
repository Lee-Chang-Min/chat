import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/update')
  async updateTokens(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    const accessToken = await this.authService.updateAccessToken(refreshToken);

    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return accessToken;
  }

}
