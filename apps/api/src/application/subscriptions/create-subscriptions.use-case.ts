import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionRepository } from '@core/subscriptions/repositories/subscription.repository';
import { SubscriptionEntity } from '@core/subscriptions/entities/subscription.entity';
import { CustomerRepository } from '@core/customer/repository/customer.repository';
import { SubscriptionPlanRepository } from '@core/subscription-plans/repositories/subscription-plan.repository';
import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';

interface ICreateSubscriptionRequest {
  customerId: string;
  planId: string;
}

interface ICreateSubscriptionResponse {
  subscription: SubscriptionEntity;
}

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionsRepository: SubscriptionRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    request: ICreateSubscriptionRequest,
  ): Promise<ICreateSubscriptionResponse> {
    const { customerId, planId } = request;

    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const plan = await this.subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const subscription = new SubscriptionEntity({
      customerId: customerId,
      planId: planId,
      subscriptionStatus: new SubscriptionStatusVO('PENDING'),
      startDate: new Date(),
      endDate: null,
      renewalAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.subscriptionsRepository.create(subscription);

    return { subscription };
  }
}
