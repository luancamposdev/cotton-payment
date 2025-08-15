import { randomUUID } from 'node:crypto';

import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/shared/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { PasswordHash } from '@core/shared/value-objects/password-hash';
import { Replace } from '@helpers/replace';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  CREATOR = 'CREATOR',
}

export type SocialProvider = 'google' | 'github';

export interface ISocialLogin {
  provider: SocialProvider;
  providerId: string;
}

export interface IUser {
  name: Name;
  email: Email;
  avatarUrl: AvatarUrl | null;
  passwordHash: PasswordHash;
  role: Role;
  socialLogins?: ISocialLogin[];
  deletedAccountAt?: Date | null;
  createdAt: Date;
}

export class UserEntity {
  private readonly _id: string;
  private props: IUser;

  constructor(props: Replace<IUser, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public set name(name: Name) {
    this.props.name = name;
  }

  public get name(): Name {
    return this.props.name;
  }

  public set email(email: Email) {
    this.props.email = email;
  }

  public get email(): Email {
    return this.props.email;
  }

  public set avatarUrl(avatarUrl: AvatarUrl | null) {
    this.props.avatarUrl = avatarUrl;
  }

  public get avatarUrl(): AvatarUrl | null {
    return this.props.avatarUrl;
  }

  public set passwordHash(passwordHash: PasswordHash) {
    this.props.passwordHash = passwordHash;
  }

  public get passwordHash(): PasswordHash {
    return this.props.passwordHash;
  }

  public set role(role: Role) {
    this.props.role = role;
  }

  public get role(): Role {
    return this.props.role;
  }

  public deleteAccount() {
    this.props.deletedAccountAt = new Date();
  }

  public get deleteAccountAt(): Date | null | undefined {
    return this.props.deletedAccountAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public addSocialLogin(login: ISocialLogin) {
    this.props.socialLogins = this.props.socialLogins ?? [];
    const exists = this.props.socialLogins.find(
      (l) => l.provider === login.provider && l.providerId === login.providerId,
    );
    if (!exists) {
      this.props.socialLogins.push(login);
    }
  }

  public findSocialLogin(
    provider: string,
    providerId: string,
  ): ISocialLogin | undefined {
    return (this.props.socialLogins ?? []).find(
      (login) => login.provider === provider && login.providerId === providerId,
    );
  }

  public get socialLogins(): ISocialLogin[] {
    return this.props.socialLogins ?? [];
  }
}
