import { CreatorsEntity } from '@core/creators/creators.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryCreatorRepository {
  private creators: CreatorsEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(creator: CreatorsEntity): Promise<void> {
    this.creators.push(creator);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<CreatorsEntity | null> {
    return this.creators.find((c) => c.id === id) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByUserId(userId: string): Promise<CreatorsEntity | null> {
    return this.creators.find((c) => c.userId === userId) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(creator: CreatorsEntity): Promise<void> {
    const index = this.creators.findIndex((c) => c.id === creator.id);
    if (index !== -1) {
      this.creators[index] = creator;
    }
  }
}
