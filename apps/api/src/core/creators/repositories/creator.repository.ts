import { CreatorsEntity } from '@core/creators/creators.entity';

export abstract class CreatorRepository {
  abstract create(creator: CreatorsEntity): Promise<void>;
  abstract findById(id: string): Promise<CreatorsEntity | null>;
  abstract findByUserId(userId: string): Promise<CreatorsEntity | null>;
  abstract save(creator: CreatorsEntity): Promise<void>;
}
