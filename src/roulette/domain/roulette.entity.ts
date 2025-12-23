import { BadRequestException } from '@nestjs/common';
import { RouletteSlot } from './roulette-slot.entity';
import { RoulettePaymentType, RouletteStatus } from '../roulette.enum';
import { SpinResult } from './spin-result';

export class Roulette {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly freeLimitPerDay: number,
    public readonly pointCost: number | null,
    public readonly cashCost: number | null,
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

    if (
      this.freeLimitPerDay === 0 &&
      this.pointCost === null &&
      this.cashCost === null
    ) {
      throw new BadRequestException(
        '최소 1개 이상의 참여 방식이 활성화되어야 합니다',
      );
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
   * 포인트 참여 가능한지 확인
   */
  canSpinWithPoint(): boolean {
    return this.pointCost !== null && this.pointCost > 0;
  }

  /**
   * 캐시 참여 가능한지 확인
   */
  canSpinWithCash(): boolean {
    return this.cashCost !== null && this.cashCost > 0;
  }

  /**
   * 특정 참여 방식이 가능한지 확인
   */
  canSpinWith(paymentType: RoulettePaymentType): boolean {
    switch (paymentType) {
      case RoulettePaymentType.FREE:
        return this.canSpinFree();
      case RoulettePaymentType.POINT:
        return this.canSpinWithPoint();
      case RoulettePaymentType.CASH:
        return this.canSpinWithCash();
      default:
        return false;
    }
  }

  /**
   * 참여 비용 조회
   */
  getCost(paymentType: RoulettePaymentType): number {
    switch (paymentType) {
      case RoulettePaymentType.FREE:
        return 0;
      case RoulettePaymentType.POINT:
        return this.pointCost ?? 0;
      case RoulettePaymentType.CASH:
        return this.cashCost ?? 0;
      default:
        return 0;
    }
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
  spin(paymentType: RoulettePaymentType): SpinResult {
    // 1. 룰렛 진행 중인지 확인
    if (!this.isActive()) {
      throw new BadRequestException('진행 중인 룰렛이 아닙니다');
    }

    // 2. 해당 참여 방식이 가능한지 확인
    if (!this.canSpinWith(paymentType)) {
      throw new BadRequestException('해당 참여 방식은 허용되지 않습니다');
    }

    // 3. 확률 기반 추첨
    const selectedSlot = this.drawSlotByWeightedSum();

    // 4. 참여 비용 계산
    const costAmount = this.getCost(paymentType);

    // 5. 결과 반환
    return new SpinResult(selectedSlot, paymentType, costAmount);
  }

  /**
   * 가중치 누적합 방식 추첨
   */
  drawSlotByWeightedSum(): RouletteSlot {
    // 1. 남은 할당량이 있는 슬롯만 필터링
    const availableSlots = this.slots.filter((slot) =>
      slot.hasRemainingQuota(),
    );

    if (availableSlots.length === 0) {
      throw new BadRequestException('모든 슬롯의 할당량이 소진되었습니다');
    }

    // 2. 남은 할당량 기준으로 가중치 누적합 계산
    // 남은 할당량을 모두 더한다.
    const totalRemaining = availableSlots.reduce(
      (sum, slot) => sum + slot.remainingQuota,
      0,
    );

    // 3. 랜덤 값 생성 (0 ~ totalRemaining)
    const random = Math.floor(Math.random() * totalRemaining);

    // 4. 누적합으로 슬롯 선택
    let cumulative = 0;
    for (const slot of availableSlots) {
      cumulative += slot.remainingQuota;
      if (random < cumulative) {
        return slot;
      }
    }

    // Fallback
    return availableSlots[availableSlots.length - 1];
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
