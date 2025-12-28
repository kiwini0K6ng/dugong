import { RouletteHistory as PrismaRouletteHistory } from '@prisma/client';
import { RouletteHistory } from '../domain/roulette-history.entity';
import { SlotType } from '../roulette.enum';

export class RouletteHistoryMapper {
  static toDomain(raw: PrismaRouletteHistory): RouletteHistory {
    return new RouletteHistory(
      raw.id,
      raw.rouletteId,
      raw.userId,
      raw.type as SlotType,
      raw.rewardAmount,
      raw.createdAt,
    );
  }
}
