import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async mockLogin(userId: number) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const payload = {
      sub: user.id, // subject (사용자 ID)
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // 토큰에서 사용자 정보 추출 (Guard에서 사용)
  async validateUser(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
