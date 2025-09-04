import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';

interface IFindPlansByCreatorRequest {
  customerId: string;
}

interface IFindPlansByCreatorResponse {
  subscriptions: SubscriptionEntity[];
}

@Injectable()
export class FindSubscriptionByCustomerUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(
    request: IFindPlansByCreatorRequest,
  ): Promise<IFindPlansByCreatorResponse> {
    const { customerId } = request;
    const subscriptions =
      await this.subscriptionRepository.findByCustomerId(customerId);

    if (!subscriptions || subscriptions.length === 0) {
      throw new NotFoundException(`Nenhum plano encontrado para este criador.`);
    }

    return { subscriptions };
  }
}
