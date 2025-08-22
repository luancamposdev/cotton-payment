export class Password {
  private readonly _password: string;

  public value(): string {
    return this._password;
  }

  private constructor(value: string) {
    this._password = value;
  }

  static create(value: string): Password {
    if (!value) {
      throw new Error('Password must be a string');
    }

    if (value.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    return new Password(value);
  }

  public toString(): string {
    return '[Password]';
  }
}
