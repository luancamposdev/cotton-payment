import { PayoutScheduleAtVo } from '@core/payout/value-objects/payout-scheduleAt.vo';

describe('ScheduledAt', () => {
  it('deve aceitar data futura', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60);
    const scheduled = new PayoutScheduleAtVo(future);
    expect(scheduled.value).toEqual(future);
  });

  it('deve lançar erro se data for passada', () => {
    const past = new Date(Date.now() - 1000 * 60 * 60);
    expect(() => new PayoutScheduleAtVo(past)).toThrow(
      'ScheduledAt must be a future date',
    );
  });
});
