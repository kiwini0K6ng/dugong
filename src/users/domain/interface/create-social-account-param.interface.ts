import { SocialProvider } from '../user.enum';

export interface CreateSocialAccountParams {
  id: number;
  userId: number;
  provider: SocialProvider;
  providerId: string; // 소셜 제공자의 고유 ID
  email: string; // 해당 소셜에서 받은 이메일
  isPrimary?: boolean; // 첫 번째 가입 계정 여부
  createdAt?: Date;
  updatedAt?: Date;
}
