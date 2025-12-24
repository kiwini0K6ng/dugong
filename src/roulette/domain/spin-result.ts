import { SlotType } from '../roulette.enum';
import { RouletteSlot } from './roulette-slot.entity';

/**
 * 룰렛 참여 결과
 */
export class SpinResult {
  constructor(public readonly slot: RouletteSlot) {}

  /**
   * 당첨 여부 (꽝이 아닌지)
   */
  isWin(): boolean {
    return this.slot.hasReward();
  }

  /**
   * 보상 타입
   */
  getRewardType(): SlotType {
    return this.slot.type;
  }

  /**
   * 보상 금액
   */
  getRewardAmount(): number {
    return this.slot.rewardAmount;
  }
}
