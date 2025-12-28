import {
  Roulette as PrismaRoulette,
  RouletteSlot as PrismaSlot,
} from '@prisma/client';
import { RouletteSlot } from '../domain/roulette-slot.entity';
import { RouletteStatus, SlotType } from '../roulette.enum';
import { Roulette } from '../domain/roulette.entity';

export class RouletteMapper {
  static toDomain(raw: PrismaRoulette & { slots: PrismaSlot[] }): Roulette {
    const slots = raw.slots.map(
      (s) =>
        new RouletteSlot(
          s.id,
          s.type as SlotType,
          s.displayName,
          s.rate,
          s.rewardAmount,
          s.sortOrder,
        ),
    );

    return new Roulette(
      raw.id,
      raw.name,
      raw.description,
      raw.freeLimitPerDay,
      raw.startAt,
      raw.endAt,
      raw.status as RouletteStatus,
      slots,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
