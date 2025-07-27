import { UUID, randomUUID } from 'node:crypto';

import { Name } from '@core/users/value-objects/name';
import { Email } from '@core/users/value-objects/email';
import { AvatarUrl } from '@core/users/value-objects/avatar-url';
import { Password } from '@core/users/value-objects/password';
import { PasswordHash } from '@core/users/value-objects/password-hash';
import { Replace } from '@helpers/replace';

export enum Role {
  CLIENT = 'CLIENT',
  CREATOR = 'CREATOR',
}

export interface IUser {
  name: Name;
  email: Email;
  avatarUrl: AvatarUrl;
  password: Password;
  passwordHash: PasswordHash;
  role: Role;
  deletedAccountAt?: Date | null;
  createdAt: Date;
}

export class User {
  private readonly _id: UUID;
  private props: IUser;

  constructor(id: UUID, props: Replace<IUser, { createdAt?: Date }>) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): UUID {
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

  public set avatarUrl(avatarUrl: AvatarUrl) {
    this.props.avatarUrl = avatarUrl;
  }

  public get avatarUrl(): AvatarUrl {
    return this.props.avatarUrl;
  }

  public set password(password: Password) {
    this.props.password = password;
  }

  public get password(): Password {
    return this.props.password;
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
}
