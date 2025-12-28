import { SlotType } from '../roulette.enum';

export class RouletteHistory {
  constructor(
    public readonly id: number,
    public readonly rouletteId: number,
    public readonly userId: number,
    public readonly type: SlotType,
    public readonly rewardAmount: number,
    public readonly createdAt: Date,
  ) {}
}
