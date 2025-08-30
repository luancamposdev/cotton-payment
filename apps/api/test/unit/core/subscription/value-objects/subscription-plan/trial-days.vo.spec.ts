import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

describe('TrialDaysVO', () => {
  it('should create valid trial days', () => {
    const trial = new TrialDaysVO(30);
    expect(trial.value).toBe(30);
    expect(trial.toString()).toBe('30 day(s)');
    expect(trial.hasTrial()).toBe(true);
  });

  it('should allow 0 days', () => {
    const trial = new TrialDaysVO(0);
    expect(trial.hasTrial()).toBe(false);
  });

  it('should throw error for negative values', () => {
    expect(() => new TrialDaysVO(-1)).toThrow();
  });

  it('should throw error for values exceeding 365', () => {
    expect(() => new TrialDaysVO(366)).toThrow();
  });

  it('should compare equality correctly', () => {
    const a = new TrialDaysVO(15);
    const b = new TrialDaysVO(15);
    const c = new TrialDaysVO(30);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
