import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/domain/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('roulette')
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  /**
   * 진행 중인 룰렛 목록 조회
   */
  @Get('active')
  async getActiveRoulettes() {
    return this.rouletteService.getActiveRoulettes();
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getMyHistory(@CurrentUser() user: Pick<User, 'id'>) {
    return this.rouletteService.getMyRouletteHistory(user.id);
  }
  /**
   * 룰렛 상세 조회 (슬롯 목록 포함)
   */
  @Get(':id')
  async getRoulette(@Param('id', ParseIntPipe) id: number) {
    return this.rouletteService.getRoulette(id);
  }

  /**
   *
   * 내 참여 가능 횟수 조회
   */
  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  async getMyStatus(
    @CurrentUser() user: Pick<User, 'id'>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rouletteService.getMyStatus(id, user.id);
  }

  @Post(':id/spin')
  @UseGuards(JwtAuthGuard)
  async spin(
    @CurrentUser() user: Pick<User, 'id'>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rouletteService.participate(id, user.id);
  }
}
