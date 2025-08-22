import { CreatorsEntity } from '@core/creators/entities/creators.entity';

export abstract class CreatorRepository {
  abstract create(creator: CreatorsEntity): Promise<void>;
  abstract findByUserId(userId: string): Promise<CreatorsEntity | null>;
  abstract save(creator: CreatorsEntity): Promise<void>;
}
