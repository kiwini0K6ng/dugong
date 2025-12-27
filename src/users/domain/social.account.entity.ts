import { CreateSocialAccountParams } from './interface/create-social-account-param.interface';
import { SocialProvider } from './user.enum';

export class SocialAccount {
  public readonly id: number;
  public readonly userId: number;
  public readonly provider: SocialProvider;
  public readonly providerId: string;
  public email: string; // 해당 소셜의 이메일 (변경 가능)
  public isPrimary: boolean; // 첫 가입 계정 여부
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: CreateSocialAccountParams) {
    this.id = params.id;
    this.userId = params.userId;
    this.provider = params.provider;
    this.providerId = params.providerId;
    this.email = params.email;
    this.isPrimary = params.isPrimary ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  // Primary 설정
  markAsPrimary(): void {
    this.isPrimary = true;
    this.updatedAt = new Date();
  }

  // Primary 해제
  unmarkAsPrimary(): void {
    this.isPrimary = false;
    this.updatedAt = new Date();
  }
}
