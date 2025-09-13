import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutRepository } from '@core/payout/repositories/payout.repository';

export class InMemoryPayoutRepository implements PayoutRepository {
  private payouts: PayoutEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(payout: PayoutEntity): Promise<void> {
    this.payouts.push(payout);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(payout: PayoutEntity): Promise<void> {
    const index = this.payouts.findIndex((p) => p.id.value === payout.id.value);
    if (index === -1) {
      throw new Error(`Payout with id ${payout.id.value} not found`);
    }
    this.payouts[index] = payout;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<PayoutEntity | null> {
    return this.payouts.find((p) => p.id.value === id) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAll(): Promise<PayoutEntity[]> {
    return this.payouts;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<void> {
    this.payouts = this.payouts.filter((p) => p.id.value !== id);
  }
}
