import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

interface IFindPlansByCreatorRequest {
  creatorId: string;
}

interface IFindPlansByCreatorResponse {
  subscriptionPlans: SubscriptionPlanEntity[];
}

@Injectable()
export class FindSubscriptionPlansByCreatorUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    request: IFindPlansByCreatorRequest,
  ): Promise<IFindPlansByCreatorResponse> {
    const { creatorId } = request;
    const subscriptionPlans =
      await this.subscriptionPlanRepository.findByCreatorId(creatorId);

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new NotFoundException(
        `Nenhum plano encontrado para o criador ${creatorId}`,
      );
    }

    return { subscriptionPlans };
  }
}
