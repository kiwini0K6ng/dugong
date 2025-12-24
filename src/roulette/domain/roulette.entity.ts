import { BadRequestException } from '@nestjs/common';
import { RouletteSlot } from './roulette-slot.entity';
import { RouletteStatus } from '../roulette.enum';
import { SpinResult } from './spin-result';

export class Roulette {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly freeLimitPerDay: number,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly status: RouletteStatus,
    private readonly slots: RouletteSlot[],
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.slots || this.slots.length === 0) {
      throw new BadRequestException('룰렛에 최소 1개 이상의 슬롯이 필요합니다');
    }

    // 확률 합계가 100%인지 검증
    const totalRate = this.slots.reduce((sum, slot) => sum + slot.rate, 0);

    // 부동소수점 오차 허용 (0.01 이내)
    if (Math.abs(totalRate - 100) > 0.01) {
      throw new BadRequestException(
        `슬롯 확률의 합계는 100%여야 합니다 (현재: ${totalRate}%)`,
      );
    }

    if (this.freeLimitPerDay === 0) {
      throw new BadRequestException('무료 참여 횟수는 1 이상이어야 합니다');
    }
  }

  /**
   * 현재 진행 중인 룰렛인지 확인
   */
  isActive(): boolean {
    if (this.status !== RouletteStatus.ACTIVE) {
      return false;
    }

    const now = new Date();
    return now >= this.startAt && now <= this.endAt;
  }

  /**
   * 무료 참여 가능한지 확인
   */
  canSpinFree(): boolean {
    return this.freeLimitPerDay > 0;
  }

  /**
   * 무료 참여 가능 횟수 확인
   * @param todaySpinCount 오늘 이미 참여한 무료 횟수
   */
  canSpinFreeToday(todaySpinCount: number): boolean {
    if (!this.canSpinFree()) {
      return false;
    }

    return todaySpinCount < this.freeLimitPerDay;
  }

  /**
   * 핵심 로직: 룰렛 돌리기 (확률 기반 추첨)
   */
  spin(): SpinResult {
    // 1. 룰렛 진행 중인지 확인
    if (!this.isActive()) {
      throw new BadRequestException('진행 중인 룰렛이 아닙니다');
    }

    // 2. 무료 참여 가능한지 확인
    if (!this.canSpinFree()) {
      throw new BadRequestException('무료 참여가 불가능합니다');
    }

    // 3. 확률 기반 추첨
    const selectedSlot = this.drawSlot();

    // 4. 결과 반환
    return new SpinResult(selectedSlot);
  }

  /**
   * 확률 기반 슬롯 추첨
   */
  private drawSlot(): RouletteSlot {
    // 0~100 사이의 랜덤 값 생성
    const random = Math.random() * 100;

    // 누적 확률로 슬롯 선택
    let cumulative = 0;

    for (const slot of this.slots) {
      cumulative += slot.rate;

      if (random < cumulative) {
        return slot;
      }
    }

    // Fallback (이론적으로 도달 불가, 부동소수점 오차 대비)
    return this.slots[this.slots.length - 1];
  }

  /**
   * 슬롯 목록 조회 (읽기 전용)
   */
  getSlots(): readonly RouletteSlot[] {
    return [...this.slots];
  }

  /**
   * 특정 슬롯 조회
   */
  getSlotById(slotId: number): RouletteSlot | undefined {
    return this.slots.find((slot) => slot.id === slotId);
  }
}
