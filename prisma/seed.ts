import { PrismaClient, SourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 세딩 시작...');

  // 1. 마스터 데이터(SourceTypeMaster) 생성
  // upsert를 사용하면 이미 데이터가 있어도 에러가 나지 않고 업데이트됩니다.
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const endDay = new Date();
  endDay.setDate(endDay.getDate() + 10);

  const roulette = [
    {
      id: 1,
      name: '첫번째 이벤트',
      description: '첫번째 이벤트',
      freeLimitPerDay: 50,
      startAt: yesterday,
      endAt: endDay,
      status: 'ACTIVE',
    },
  ];

  for (const item of roulette) {
    await prisma.roulette.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  const rouletteSlot = [
    {
      id: 1,
      rouletteId: 1,
      type: 'NOTHING',
      displayName: '꽝',
      rate: 50,
      rewardAmount: 0,
      sortOrder: 3,
    },
    {
      id: 2,
      rouletteId: 1,
      type: 'POINT',
      displayName: '포인트',
      rate: 40,
      rewardAmount: 100,
      sortOrder: 2,
    },
    {
      id: 3,
      rouletteId: 1,
      type: 'CASH',
      displayName: '캐시',
      rate: 10,
      rewardAmount: 1,
      sortOrder: 1,
    },
  ];

  for (const item of rouletteSlot) {
    await prisma.rouletteSlot.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // 2. 가짜 유저 및 데이터 생성 (예시)
  await prisma.user.upsert({
    where: { email: 'dugong@example.com' },
    update: {},
    create: {
      email: 'dugong@example.com',
      name: '김듀공',
      nickname: '아기듀공',
      // 필요하다면 연관된 데이터도 함께 생성 가능
      socialAccounts: {
        create: {
          provider: 'NAVER',
          providerId: '123456789',
          email: 'dugong@example.com',
          isPrimary: true,
        },
      },
    },
  });

  console.log('✅ 세딩 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
