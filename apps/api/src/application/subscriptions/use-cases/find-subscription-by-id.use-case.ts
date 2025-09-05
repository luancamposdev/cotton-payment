import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';

interface IFindPlansByCreatorRequest {
  id: string;
}

interface IFindPlansByCreatorResponse {
  subscription: SubscriptionEntity;
}

@Injectable()
export class FindSubscriptionByIdUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(
    request: IFindPlansByCreatorRequest,
  ): Promise<IFindPlansByCreatorResponse> {
    const { id } = request;
    const subscription = await this.subscriptionRepository.findById(id);

    if (!subscription) {
      throw new NotFoundException(`Nenhum plano encontrado para este criador.`);
    }

    return { subscription };
  }
}
