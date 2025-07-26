export class AvatarUrl {
    private readonly _url: string;

    public getValue(): string {
        return this._url;
    }

    static create(url: string): AvatarUrl {
        if (!AvatarUrl.isValid(url)) {
            throw new Error('Invalid avatar URL');
        }
        return new AvatarUrl(url.trim());
    }

    public static isValid(url: string): boolean {
        if (!url) return false;

        const trimmed = url.trim();

        const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/gm;
        return urlRegex.test(trimmed);
    }

    constructor(url: string) {
        if (!url.startsWith('http')) {
            throw new Error('Invalid avatar URL');
        }
        this._url = url;
    }
}