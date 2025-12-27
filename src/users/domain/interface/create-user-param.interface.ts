import {
  SocialProvider,
  UserRole,
  UserStatus,
} from 'src/users/domain/user.enum';

export interface CreateUserParams {
  id: number;
  email: string; // 대표 이메일
  nickname: string; // 사용자가 수정 가능
  profileImage?: string; // 첫 소셜 로그인의 프로필 이미지
  role?: UserRole;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
