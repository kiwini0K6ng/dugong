/**
 * 룰렛 상태
 */
export enum RouletteStatus {
  ACTIVE = 'ACTIVE', // 진행 중
  INACTIVE = 'INACTIVE', // 비활성화
  ENDED = 'ENDED', // 종료됨
}

/**
 * 슬롯 타입
 */
export enum SlotType {
  NOTHING = 'NOTHING', // 꽝
  POINT = 'POINT', // 포인트 지급
  CASH = 'CASH', // 캐시 지급
}

/**
 * 참여 방식
 */
export enum RoulettePaymentType {
  FREE = 'FREE', // 무료
  POINT = 'POINT', // 포인트 소비
  CASH = 'CASH', // 캐시 소비
}
