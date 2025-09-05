import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';

interface IFindSubscriptionPlanRequest {
  id: string;
}

interface IFindSubscriptionPlanResponse {
  subscriptionPlan: SubscriptionPlanEntity;
}

@Injectable()
export class FindSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    request: IFindSubscriptionPlanRequest,
  ): Promise<IFindSubscriptionPlanResponse> {
    const { id } = request;

    const subscriptionPlan = await this.subscriptionPlanRepository.findById(id);

    if (!subscriptionPlan) throw new NotFoundException(`Plano não encontrado.`);

    return { subscriptionPlan };
  }
}
