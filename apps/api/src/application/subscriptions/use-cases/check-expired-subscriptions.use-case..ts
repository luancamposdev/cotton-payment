import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { SubscriptionStatusService } from '@core/subscriptions/services/subscription-status.service';

@Injectable()
export class CheckExpiredSubscriptionsUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  @Cron('0 * * * *') // roda a cada hora
  async handle() {
    const subs = await this.subscriptionRepository.findAllActiveOrTrial();
    const now = new Date();

    for (const sub of subs) {
      const updated = SubscriptionStatusService.recalculate(sub, now);
      await this.subscriptionRepository.save(updated);
    }
  }
}
