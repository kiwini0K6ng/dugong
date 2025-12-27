import { CreateUserParams } from './interface/create-user-param.interface';
import { SocialProvider, UserRole, UserStatus } from './user.enum';

export class User {
  public readonly id: number;
  public email: string; // 대표 이메일
  public nickname: string; // 사용자 수정 가능
  public profileImage: string | null; // 사용자 수정 가능
  public role: UserRole;
  public status: UserStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(params: CreateUserParams) {
    this.id = params.id;
    this.email = params.email;
    this.nickname = params.nickname;
    this.profileImage = params.profileImage ?? null;
    this.role = params.role ?? UserRole.USER;
    this.status = params.status ?? UserStatus.ACTIVE;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
  }

  // 팩토리 메서드
  static create(param: CreateUserParams): User {
    // 유효성 검증
    // 비즈니스 로직
    return new User(param);
  }

  // 도메인 메서드들
  suspend(): void {
    if (this.status === UserStatus.DELETED) {
      throw new Error('탈퇴한 사용자는 정지할 수 없습니다');
    }
    this.status = UserStatus.SUSPENDED;
  }

  activate(): void {}
  delete(): void {}

  // Getter들
  getId(): number {
    return this.id;
  }
  getEmail(): string {
    return this.email;
  }
}
