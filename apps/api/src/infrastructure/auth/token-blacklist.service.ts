import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly blacklist = new Set<string>();

  addToBlacklist(token: string): void {
    this.blacklist.add(token);
  }

  isBlacklisted(token: string | null): boolean {
    return this.blacklist.has(<string>token);
  }
}
