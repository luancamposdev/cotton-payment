import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';
import { UpdateSubscriptionDto } from '@/interfaces/subscription/dto/update-subscription.dto';

interface IUpdateSubscriptionResponse {
  subscription: SubscriptionEntity;
}

@Injectable()
export class UpdateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(
    subscriptionId: string,
    dto: UpdateSubscriptionDto,
  ): Promise<IUpdateSubscriptionResponse> {
    const subscription =
      await this.subscriptionRepository.findById(subscriptionId);

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada.');
    }

    if (dto.status) {
      subscription.status = new SubscriptionStatusVO(dto.status);
    }

    if (dto.endDate !== undefined) {
      subscription.endDate = dto.endDate;
    }

    if (dto.renewalAt !== undefined) {
      subscription.renewalAt = dto.renewalAt;
    }

    await this.subscriptionRepository.save(subscription);

    return { subscription };
  }
}
