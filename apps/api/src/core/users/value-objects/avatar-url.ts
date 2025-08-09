export class AvatarUrl {
  private readonly _url: string;

  public get value(): string {
    return this._url;
  }

  private static generateAvatarUrl(name: string): string {
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=#000&rounded=true`;
  }

  static create(url: string | null | undefined, name: string): AvatarUrl {
    if (!url || !AvatarUrl.isValid(url)) {
      const generateUrl = AvatarUrl.generateAvatarUrl(name);

      return new AvatarUrl(generateUrl);
    }
    return new AvatarUrl(url.trim());
  }

  public static isValid(url: string): boolean {
    if (!url) return false;

    const trimmed: string = url.trim();

    const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/gm;
    return urlRegex.test(trimmed);
  }

  private constructor(url: string) {
    if (!url.startsWith('http')) {
      throw new Error('Invalid avatar URL');
    }
    this._url = url;
  }
}
