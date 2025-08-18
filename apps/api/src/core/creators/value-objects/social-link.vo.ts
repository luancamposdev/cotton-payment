export type SocialProvider =
  | 'youtube'
  | 'instagram'
  | 'linkedin'
  | 'tiktok'
  | 'twitter'
  | 'github';

export class SocialLink {
  private readonly _url: string;
  private readonly _provider: SocialProvider;

  private static providerDomains: Record<SocialProvider, string> = {
    youtube: 'youtube.com',
    instagram: 'instagram.com',
    linkedin: 'linkedin.com',
    tiktok: 'tiktok.com',
    twitter: 'twitter.com',
    github: 'github.com',
  };

  constructor(url: string) {
    if (!this.isValidUrl(url)) throw new Error('URL inválida');

    const provider = this.getProviderFromUrl(url);
    if (!provider) throw new Error('Provider não suportado');

    this._url = url;
    this._provider = provider;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getProviderFromUrl(url: string): SocialProvider | null {
    const hostname = new URL(url).hostname;
    return (
      (Object.entries(SocialLink.providerDomains).find(([key, domain]) =>
        hostname.includes(domain),
      )?.[0] as SocialProvider) || null
    );
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
