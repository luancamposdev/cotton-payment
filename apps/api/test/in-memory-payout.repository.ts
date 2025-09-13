import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';

export class InMemoryPayoutRepository implements PayoutRepository {
  private payouts: PayoutEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(payout: PayoutEntity): Promise<void> {
    this.payouts.push(payout);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: PayoutIdVO): Promise<PayoutEntity | null> {
    const found = this.payouts.find((p) => p.id.value === id.value);
    return found ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByCreatorConfigId(
    creatorPayoutConfigId: CreatorPayoutConfigIdVO,
  ): Promise<PayoutEntity[]> {
    return this.payouts.filter(
      (p) =>
        p.props.creatorPayoutConfigId.value === creatorPayoutConfigId.value,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(payout: PayoutEntity): Promise<void> {
    const index = this.payouts.findIndex((p) => p.id.value === payout.id.value);
    if (index === -1) {
      throw new Error(`Pagamento com id ${payout.id.value} não encontrado.`);
    }
    this.payouts[index] = payout;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: PayoutIdVO): Promise<void> {
    this.payouts = this.payouts.filter((p) => p.id.value !== id.value);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async list(): Promise<PayoutEntity[]> {
    return this.payouts;
  }
}
