import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';

export abstract class PayoutRepository {
  abstract create(payout: PayoutEntity): Promise<void>;
  abstract findById(id: PayoutIdVO): Promise<PayoutEntity | null>;
  abstract findByCreatorConfigId(
    creatorPayoutConfigId: CreatorPayoutConfigIdVO,
  ): Promise<PayoutEntity[]>;
  abstract save(payout: PayoutEntity): Promise<void>;
  abstract delete(id: PayoutIdVO): Promise<void>;
  abstract list(): Promise<PayoutEntity[]>;
}
