import { PayoutEntity } from '../entities/payout.entity';

export abstract class PayoutRepository {
  abstract create(payout: PayoutEntity): Promise<void>;
  abstract save(payout: PayoutEntity): Promise<void>;
  abstract findById(id: string): Promise<PayoutEntity | null>;
  abstract findAll(): Promise<PayoutEntity[]>;
  abstract delete(id: string): Promise<void>;
}
