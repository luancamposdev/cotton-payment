import * as bcrypt from 'bcrypt';
import { Password } from '@core/users/value-objects/password';

export class PasswordHash {
  private readonly _hash: string;

  private constructor(hash: string) {
    this._hash = hash;
  }

  public value(): string {
    return this._hash;
  }

  public async compare(password: Password): Promise<boolean> {
    return bcrypt.compare(password.value(), this._hash);
  }

  static async fromPassword(password: Password): Promise<PasswordHash> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password.value(), saltRounds);
    return new PasswordHash(hashed);
  }

  static fromHash(hash: string): PasswordHash {
    if (!hash || !hash.startsWith('$2')) {
      throw new Error('Invalid password hash');
    }

    return new PasswordHash(hash);
  }
}
