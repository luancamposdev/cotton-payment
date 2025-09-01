import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

interface IFindPlansByCreatorRequest {
  creatorId: string;
}

interface IFindPlansByCreatorResponse {
  subscriptionPlan: SubscriptionPlanEntity[];
}

@Injectable()
export class FindSubscriptionPlansByCreatorUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    request: IFindPlansByCreatorRequest,
  ): Promise<IFindPlansByCreatorResponse> {
    const subscriptionPlan =
      await this.subscriptionPlanRepository.findByCreatorId(request.creatorId);

    if (!subscriptionPlan || subscriptionPlan.length === 0) {
      throw new NotFoundException(
        `No subscription plans found for creator ${request.creatorId}`,
      );
    }

    return { subscriptionPlan };
  }
}
