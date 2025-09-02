import { FeaturesVO } from '@core/subscription-plans/value-objects/subscription-plan/features.vo';

describe('FeaturesVO', () => {
  it('should create a valid features list', () => {
    const features = ['API Access', 'Analytics', 'Support'];
    const vo = new FeaturesVO(features);

    expect(vo.value).toEqual(features);
    expect(vo.toString()).toBe('API Access, Analytics, Support');
  });

  it('should trim spaces from features', () => {
    const features = ['  API Access  ', '  Support '];
    const vo = new FeaturesVO(features);

    expect(vo.value).toEqual(['API Access', 'Support']);
  });

  it('should throw error if features is not an array', () => {
    // @ts-expect-error Testing invalid input
    expect(() => new FeaturesVO(null)).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => new FeaturesVO('invalid')).toThrow();
  });

  it('should throw error if any feature is an empty string', () => {
    expect(() => new FeaturesVO(['API Access', ''])).toThrow();
  });

  it('should compare equality correctly', () => {
    const a = new FeaturesVO(['API Access', 'Support']);
    const b = new FeaturesVO(['API Access', 'Support']);
    const c = new FeaturesVO(['Support', 'API Access']);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
