import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

export class InMemorySubscriptionPlanRepository
  implements SubscriptionPlanRepository
{
  public plan: SubscriptionPlanEntity[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(plan: SubscriptionPlanEntity): Promise<void> {
    this.plan.push(plan);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<SubscriptionPlanEntity | null> {
    const plan = this.plan.find((item) => item.id === id);
    return plan ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByCreatorId(creatorId: string): Promise<SubscriptionPlanEntity[]> {
    return this.plan.filter((item) => item.creatorId === creatorId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(plan: SubscriptionPlanEntity): Promise<void> {
    const index = this.plan.findIndex((item) => item.id === plan.id);

    if (index >= 0) {
      this.plan[index] = plan;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<void> {
    this.plan = this.plan.filter((item) => item.id !== id);
  }
}
