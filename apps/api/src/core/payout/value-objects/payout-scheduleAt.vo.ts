export class PayoutScheduleAtVo {
  public readonly value: Date;

  constructor(value: Date) {
    if (isNaN(value.getTime())) {
      throw new Error('ScheduledAt must be a valid Date');
    }

    if (value.getTime() <= Date.now()) {
      throw new Error('ScheduledAt must be a future date');
    }

    this.value = value;
  }
}
