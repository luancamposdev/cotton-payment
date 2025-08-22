export class AvatarUrlVo {
  private readonly _url: string;

  public get value(): string {
    return this._url;
  }

  static create(url: string | null | undefined): AvatarUrlVo | null {
    if (!url) {
      return null;
    }

    const trimmedUrl = url.trim();

    if (!this.isValid(trimmedUrl)) {
      throw new Error('URL inválida.');
    }

    return new AvatarUrlVo(trimmedUrl);
  }

  public static isValid(url: string | null | undefined): boolean {
    if (!url) return false;

    const urlRegex = /^(https?:\/\/)[^\s$.?#].\S*$/;
    return urlRegex.test(url.trim());
  }

  private constructor(url: string) {
    this._url = url;
  }
}
