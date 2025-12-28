import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RouletteService } from './roulette.service';

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
   * @todo: 실제 인증된 유저 ID를 가져오는 로직 필요 (@CurrentUser() 데코레이터 등)
   */
  @Get(':id/my-status')
  async getMyStatus(@Param('id', ParseIntPipe) id: number) {
    // TODO: 실제 유저 ID 가져오기
    const userId = 1; // 임시 유저 ID
    return this.rouletteService.getMyStatus(id, userId);
  }

  @Post(':id/spin')
  async spin(@Param('id', ParseIntPipe) id: number) {
    // TODO: 실제 유저 ID 가져오기
    const userId = 1; // 임시 유저 ID
    return this.rouletteService.participate(id, userId);
  }
}
