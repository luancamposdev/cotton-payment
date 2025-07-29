export class Email {
  private readonly _email: string;

  get value(): string {
    return this._email;
  }

  static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new Error('Email address is invalid');
    }
    return new Email(email.trim().toLowerCase());
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
