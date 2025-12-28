import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RouletteMapper } from './mapper/roulette.mapper';
import { Roulette } from './domain/roulette.entity';
import { RouletteStatus } from './roulette.enum';
import { RouletteHistoryMapper } from './mapper/roulette-history.mapper';
import { RouletteHistory } from './domain/roulette-history.entity';

@Injectable()
export class RouletteService {
  constructor(private prisma: PrismaService) {}

  /**
   * 진행 중인 룰렛 목록 조회
   */
  async getActiveRoulettes(): Promise<Roulette[]> {
    const now = new Date();

    const data = await this.prisma.roulette.findMany({
      where: {
        status: RouletteStatus.ACTIVE,
        startAt: { lte: now },
        endAt: { gte: now },
      },
      include: {
        slots: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) => RouletteMapper.toDomain(item));
  }

  /**
   * 룰렛 상세 조회 (슬롯 포함)
   */
  async getRoulette(id: number): Promise<Roulette> {
    const data = await this.prisma.roulette.findUnique({
      where: { id },
      include: {
        slots: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!data) {
      throw new NotFoundException(`룰렛을 찾을 수 없습니다. (ID: ${id})`);
    }

    return RouletteMapper.toDomain(data);
  }

  /**
   * 내 참여 가능 횟수 조회
   */
  async getMyStatus(rouletteId: number, userId: number) {
    const roulette = await this.getRoulette(rouletteId);

    const todaySpinCount = await this.prisma.rouletteHistory.count({
      where: {
        rouletteId,
        userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return {
      rouletteId,
      canSpin: roulette.canSpinFreeToday(todaySpinCount),
      remainingSpins: Math.max(0, roulette.freeLimitPerDay - todaySpinCount),
      totalSpinsToday: todaySpinCount,
      dailyLimit: roulette.freeLimitPerDay,
    };
  }

  /**
   * 룰렛 참여
   * @param rouletteId
   * @param userId
   * @returns
   */
  async participate(rouletteId: number, userId: number) {
    const roulette = await this.getRoulette(rouletteId);
    const status = await this.getMyStatus(rouletteId, userId);
    if (!status.canSpin) {
      throw new BadRequestException('참여할 수 없습니다.');
    }

    const spinResult = roulette.spin();
    return await this.prisma.rouletteHistory.create({
      data: {
        rouletteId,
        userId,
        type: spinResult.slot.type,
        rewardAmount: spinResult.slot.rewardAmount,
      },
    });
  }
}
