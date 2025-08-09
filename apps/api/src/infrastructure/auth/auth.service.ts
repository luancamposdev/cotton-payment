import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@core/users/repositories/user.repository';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Password } from '@core/shared/value-objects/password';
import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { PasswordHash } from '@core/shared/value-objects/password-hash';
import { TokenBlacklistService } from '@infrastructure/auth/token-blacklist.service';

export type OAuthProvider = 'google' | 'github';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  /**
   * Valida as credenciais do usuário.
   * Usado pelo LocalAuthGuard.
   *
   * @param email O email do usuário.
   * @param password A senha do usuário.
   * @returns A entidade do usuário se as credenciais forem válidas.
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    if (user.deleteAccountAt) return null;

    const isValid = await user.passwordHash.compare(Password.create(password));
    if (!isValid) return null;

    return user;
  }

  async validateOAuthLogin({
    provider,
    providerId,
    email,
    name,
    avatarUrl,
  }: {
    provider: 'google' | 'github';
    providerId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<null | UserEntity> {
    let user = await this.userRepository.findBySocialLogin(
      provider,
      providerId,
    );
    if (user) return user;

    user = await this.userRepository.findByEmail(email);
    if (user) {
      user.addSocialLogin({ provider, providerId });
      await this.userRepository.save(user);

      return user;
    }

    user = new UserEntity({
      name: Name.create(name),
      email: Email.create(email),
      avatarUrl: AvatarUrl.create(avatarUrl),
      passwordHash: await PasswordHash.fromPassword(
        Password.create(Math.random().toString(36).slice(2)),
      ),
      role: Role.CLIENT,
      socialLogins: [{ provider, providerId }],
    });

    await this.userRepository.create(user);
    return user;
  }

  signJwt(user: UserEntity): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email.value,
      role: user.role,
    });
  }

  async loginWithCredentials(email: string, password: string) {
    const user = await this.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException('Email ou senha inválidos');

    const access_token = this.signJwt(user);
    return { user, access_token };
  }

  /**
   * Adiciona um token à lista negra para invalidá-lo.
   * @param token O token JWT a ser invalidado.
   */
  invalidateToken(token: string): void {
    this.tokenBlacklistService.addToBlacklist(token);
  }

  /**
   * Verifica se um token está na lista negra.
   * @param token O token JWT a ser verificado.
   * @returns Retorna true se o token estiver na blacklist, false caso contrário.
   */
  isTokenInvalid(token: string | null): boolean {
    return this.tokenBlacklistService.isBlacklisted(token);
  }
  async loginOAuth(payload: {
    provider: OAuthProvider;
    providerId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    const user = await this.validateOAuthLogin(payload);

    if (!user) return null;

    const access_token = this.signJwt(user);
    return { user, access_token };
  }
}
