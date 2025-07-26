export class Email {
  private readonly _email: string;

  static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new Error('Email address is invalid');
    }
    return new Email(email.trim().toLowerCase());
  }

  public getValue(): string {
    return this._email;
  }

  private static isValid(email: string): boolean {
    if (!email) return false;

    const trimmed: string = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  }

  private constructor(email: string) {
    this._email = email;
  }
}
