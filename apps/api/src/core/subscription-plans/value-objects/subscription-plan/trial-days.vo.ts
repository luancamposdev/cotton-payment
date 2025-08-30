export class TrialDaysVO {
  private readonly _value: number;
  private static readonly MAX_DAYS = 365;

  private static validate(value: number): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(
        'Trial days must be an integer greater than or equal to 0.',
      );
    }

    if (value > TrialDaysVO.MAX_DAYS) {
      throw new Error(`Trial days cannot exceed ${TrialDaysVO.MAX_DAYS}.`);
    }
  }

  constructor(value: number) {
    TrialDaysVO.validate(value);
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  toString(): string {
    return `${this._value} day(s)`;
  }

  equals(other: TrialDaysVO): boolean {
    return this._value === other.value;
  }

  hasTrial(): boolean {
    return this._value > 0;
  }
}
