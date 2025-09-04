import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';

interface ICancelSubscriptionResponse {
  subscription: SubscriptionEntity;
}

@Injectable()
export class CancelSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(id: string): Promise<ICancelSubscriptionResponse> {
    const subscription = await this.subscriptionRepository.findById(id);

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada.');
    }

    subscription.status = new SubscriptionStatusVO('CANCELLED');
    subscription.endDate = new Date();
    await this.subscriptionRepository.save(subscription);

    return { subscription };
  }
}
