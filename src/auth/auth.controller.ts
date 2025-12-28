import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common';
import { MockLoginDto } from 'src/dto/mock-login';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('mock-login')
  async mockLogin(@Body() mockLoginDto: MockLoginDto) {
    return await this.authService.mockLogin(mockLoginDto.userId);
  }
}
