import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
// Injectable: 의존성 주입을 받기 위해 사용되는 데코레이터
// NestMiddleware: NestJS에서 미들웨어를 정의하기 위해 사용하는 인터페이스
// HttpException, HttpStatus: HTTP 예외 처리와 상태 코드를 관리하는 클래스

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { accessToken } = req.body;

    if (!accessToken) {
      throw new HttpException('Access Token is required', HttpStatus.BAD_REQUEST);
    }

    if (!req.cookies['connect.sid']) {
        throw new HttpException('Login Session not found', HttpStatus.UNAUTHORIZED);
      }

    try {
      const result = await this.authService.verifyAccessToken(accessToken);
      if (!result) {
        throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
      }
      
      // 검증된 데이터를 request 객체에 저장하여 다음 핸들러에서 사용할 수 있게 함
      req['user'] = result;

      next();
    } catch (error) {
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }
  }
} 