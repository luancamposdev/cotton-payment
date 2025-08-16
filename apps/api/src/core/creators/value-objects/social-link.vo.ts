export type SocialProvider = 'youtube' | 'instagram' | 'linkedin' | 'tiktok';

export class SocialLink {
  private readonly _url: string;
  private readonly _provider: SocialProvider;

  private static providerDomains: Record<SocialProvider, string> = {
    youtube: 'youtube.com',
    instagram: 'instagram.com',
    linkedin: 'linkedin.com',
    tiktok: 'tiktok.com',
  };

  constructor(provider: SocialProvider, url: string) {
    this._provider = provider;

    if (!this.isValidUrl(url)) {
      throw new Error('URL inválida');
    }

    if (!this.isValidProviderUrl(provider, url)) {
      throw new Error(`URL não corresponde ao provedor ${provider}`);
    }

    this._url = url;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidProviderUrl(provider: SocialProvider, url: string): boolean {
    const domain = SocialLink.providerDomains[provider];
    return new URL(url).hostname.includes(domain);
  }

  get value(): string {
    return this._url;
  }

  get provider(): SocialProvider {
    return this._provider;
  }

  equals(other: SocialLink): boolean {
    return this._url === other.value && this._provider === other.provider;
  }
}
