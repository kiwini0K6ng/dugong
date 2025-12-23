import { Test, TestingModule } from '@nestjs/testing';
import { RouletteService } from './roulette.service';
import { Roulette } from './domain/roulette.entity';
import { RoulettePaymentType, RouletteStatus, SlotType } from './roulette.enum';
import { RouletteSlot } from './domain/roulette-slot.entity';
import { SpinResult } from './domain/spin-result';

describe('RouletteService', () => {
  let service: RouletteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouletteService],
    }).compile();

    service = module.get<RouletteService>(RouletteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('확률 분포 테스트', () => {
    const createTestRoulette = (slots: RouletteSlot[]): Roulette => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      return new Roulette(
        1,
        'Test Roulette',
        '',
        100,
        null,
        null,
        yesterday,
        tomorrow,
        RouletteStatus.ACTIVE,
        slots,
      );
    };

    it('설정된 확률대로 각 슬롯이 추첨되어야 함', () => {
      // Given: 50% 꽝, 30% 포인트, 20% 캐시
      const slots: RouletteSlot[] = [
        new RouletteSlot(1, SlotType.NOTHING, '꽝', 50, 0, 1, 50, 50),
        new RouletteSlot(2, SlotType.POINT, '포인트', 30, 100, 2, 30, 30),
        new RouletteSlot(3, SlotType.CASH, '캐시', 20, 50, 3, 20, 20),
      ];

      const roulette = createTestRoulette(slots);

      // When: 100번 추첨
      const spinCount = 100;
      const results = {
        [SlotType.NOTHING]: 0,
        [SlotType.POINT]: 0,
        [SlotType.CASH]: 0,
      };

      for (let i = 0; i < spinCount; i++) {
        const result = roulette.spin(RoulettePaymentType.FREE) as SpinResult;
        result.slot.remainingQuota--;
        const slotType = result.getRewardType();
        results[slotType]++;
      }

      // Then: 각 슬롯의 실제 확률이 설정값의 ±1% 이내여야 함
      const tolerance = 0.01; // 1% 오차 허용

      const nothingRate = (results[SlotType.NOTHING] / spinCount) * 100;
      const pointRate = (results[SlotType.POINT] / spinCount) * 100;
      const cashRate = (results[SlotType.CASH] / spinCount) * 100;

      expect(nothingRate).toBeGreaterThanOrEqual(50 - 50 * tolerance);
      expect(nothingRate).toBeLessThanOrEqual(50 + 50 * tolerance);

      expect(pointRate).toBeGreaterThanOrEqual(30 - 30 * tolerance);
      expect(pointRate).toBeLessThanOrEqual(30 + 30 * tolerance);

      expect(cashRate).toBeGreaterThanOrEqual(20 - 20 * tolerance);
      expect(cashRate).toBeLessThanOrEqual(20 + 20 * tolerance);
    });

    it('확률 합계가 100%가 아니면 룰렛 생성 실패', () => {
      // Given: 확률 합계가 90%인 슬롯들
      const invalidSlots: RouletteSlot[] = [
        new RouletteSlot(1, SlotType.NOTHING, '꽝', 50, 0, 1, 50, 100),
        new RouletteSlot(2, SlotType.POINT, '포인트', 40, 100, 2, 40, 100),
      ];

      // When & Then: 룰렛 생성 시 에러 발생
      expect(() => createTestRoulette(invalidSlots)).toThrow(
        '슬롯 확률의 합계는 100%여야 합니다',
      );
    });
  });
});
