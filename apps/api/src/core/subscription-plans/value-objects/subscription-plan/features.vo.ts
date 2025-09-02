export class FeaturesVO {
  private readonly _features: string[];

  private static validateFeatures(features: string[]): string[] {
    if (!features || !Array.isArray(features)) {
      throw new Error('Features must be a valid array of strings.');
    }

    if (features.some((feature) => feature.trim() === '')) {
      throw new Error('Each feature must be a non-empty string.');
    }

    return features.map((f) => f.trim());
  }

  constructor(public readonly features: string[]) {
    this._features = FeaturesVO.validateFeatures(features);
  }

  get value(): string[] {
    return this._features;
  }

  toString(): string {
    return this._features.join(', ');
  }

  equals(other: FeaturesVO): boolean {
    if (this._features.length !== other.value.length) {
      return false;
    }
    return this._features.every((f, i) => f === other.value[i]);
  }
}
