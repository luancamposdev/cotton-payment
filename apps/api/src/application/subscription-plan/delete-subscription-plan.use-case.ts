import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

@Injectable()
export class DeleteSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute({ id }: { id: string }): Promise<void> {
    const subscriptionPlan = await this.subscriptionPlanRepository.findById(id);

    if (!subscriptionPlan)
      throw new NotFoundException(`Plano não encontrado para o id: ${id}`);

    await this.subscriptionPlanRepository.delete(id);
  }
}
