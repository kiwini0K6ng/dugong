import {
  User as PrismaUser,
  SocialAccount as PrismaSocialAccount,
} from '@prisma/client';
import { User } from '../domain/user.entity';
import { SocialAccount } from '../domain/social.account.entity';
import { UserRole, UserStatus, SocialProvider } from '../domain/user.enum';

export class UserMapper {
  /**
   * Prisma User → Domain User
   */
  static toDomain(raw: PrismaUser): User {
    return new User({
      id: raw.id,
      email: raw.email,
      nickname: raw.nickname,
      profileImage: raw.profileImage,
      role: raw.role as UserRole,
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  /**
   * Prisma User + SocialAccounts → Domain User (관계 포함)
   */
  static toDomainWithRelations(
    raw: PrismaUser & { socialAccounts?: PrismaSocialAccount[] },
  ): User {
    const user = this.toDomain(raw);

    // 필요시 socialAccounts도 매핑 가능
    // if (raw.socialAccounts) {
    //   user.socialAccounts = raw.socialAccounts.map(sa => SocialAccountMapper.toDomain(sa));
    // }

    return user;
  }

  /**
   * Domain User → Prisma CreateInput
   */
  static toPrismaCreate(user: User) {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * Domain User → Prisma UpdateInput
   */
  static toPrismaUpdate(user: User) {
    return {
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      updatedAt: new Date(),
      deletedAt: user.deletedAt,
    };
  }
}

export class SocialAccountMapper {
  /**
   * Prisma SocialAccount → Domain SocialAccount
   */
  static toDomain(raw: PrismaSocialAccount): SocialAccount {
    return new SocialAccount({
      id: raw.id,
      userId: raw.userId,
      provider: raw.provider as SocialProvider,
      providerId: raw.providerId,
      email: raw.email,
      isPrimary: raw.isPrimary,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  /**
   * Domain SocialAccount → Prisma CreateInput
   */
  static toPrismaCreate(account: SocialAccount) {
    return {
      id: account.id,
      userId: account.userId,
      provider: account.provider,
      providerId: account.providerId,
      email: account.email,
      isPrimary: account.isPrimary,
    };
  }

  /**
   * Domain SocialAccount → Prisma UpdateInput
   */
  static toPrismaUpdate(account: SocialAccount) {
    return {
      email: account.email,
      isPrimary: account.isPrimary,
      updatedAt: new Date(),
    };
  }
}
