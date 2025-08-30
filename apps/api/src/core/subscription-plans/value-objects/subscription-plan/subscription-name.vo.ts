export class SubscriptionNameVo {
  private readonly _name: string;

  private static validateName(name: string): void {
    const trimmed = name.trim();

    if (!trimmed || trimmed.length < 3) {
      throw new Error('Subscription name must be at least 3 characters long');
    }

    if (trimmed.length > 100) {
      throw new Error('Subscription name must be at most 100 characters long');
    }
  }

  get value(): string {
    return this._name;
  }

  toString(): string {
    return this._name;
  }

  equals(other: SubscriptionNameVo): boolean {
    return this._name === other.value;
  }

  constructor(name: string) {
    SubscriptionNameVo.validateName(name);
    this._name = name.trim();
  }
}
