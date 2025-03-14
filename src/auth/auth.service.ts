import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return payload;
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return payload;
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const userId = this.verifyRefreshToken(refreshToken);

      const tokens = await this.generateTokens(userId);

      return tokens.accessToken;
    } catch (e) {
      return null;
    }
  }

  private async generateTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
    const tokens = { accessToken, refreshToken };

    return tokens;
  }
}
