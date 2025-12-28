import { BadRequestException } from '@nestjs/common';
import { SlotType } from '../roulette.enum';

/**
 * 룰렛 슬롯
 */
export class RouletteSlot {
  constructor(
    public readonly id: number,
    public readonly type: SlotType,
    public readonly displayName: string,
    public readonly rate: number, // 0.01 ~ 100
    public readonly rewardAmount: number,
    public readonly sortOrder: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.rate < 0 || this.rate > 100) {
      throw new BadRequestException('확률은 0~100 사이여야 합니다');
    }

    if (this.rewardAmount < 0) {
      throw new BadRequestException('보상 금액은 0 이상이어야 합니다');
    }

    if (this.type === SlotType.NOTHING && this.rewardAmount !== 0) {
      throw new BadRequestException('꽝 슬롯은 보상 금액이 0이어야 합니다');
    }
  }

  /**
   * 보상이 있는 슬롯인지 확인
   */
  hasReward(): boolean {
    return this.type !== SlotType.NOTHING && this.rewardAmount > 0;
  }
}
