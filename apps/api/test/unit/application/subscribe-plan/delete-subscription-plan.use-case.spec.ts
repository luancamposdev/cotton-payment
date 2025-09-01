import { NotFoundException } from '@nestjs/common';
import { InMemorySubscriptionPlanRepository } from '@test/in-memory-subscription-plan.repository';
import { CreateSubscriptionPlanUseCase } from '@application/subscription-plan/create-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from '@application/subscription-plan/delete-subscription-plan.use-case';

describe('SubscriptionPlan Delete Use Case', () => {
  let subscriptionPlanRepository: InMemorySubscriptionPlanRepository;
  let createUseCase: CreateSubscriptionPlanUseCase;
  let deleteUseCase: DeleteSubscriptionPlanUseCase;

  beforeEach(() => {
    subscriptionPlanRepository = new InMemorySubscriptionPlanRepository();
    createUseCase = new CreateSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );
    deleteUseCase = new DeleteSubscriptionPlanUseCase(
      subscriptionPlanRepository,
    );
  });

  it('should delete subscription plan successfully', async () => {
    const createDTO = {
      creatorId: 'creator-1',
      name: 'Basic Plan',
      description: 'Original description',
      price: 100,
      currency: 'USD',
      billingInterval: 'MONTHLY' as const,
      trialDays: 7,
    };

    const { subscriptionPlan } = await createUseCase.execute(createDTO);

    await deleteUseCase.execute({ id: subscriptionPlan.id });

    const found = await subscriptionPlanRepository.findById(
      subscriptionPlan.id,
    );
    expect(found).toBeNull();
  });

  it('should throw NotFoundException if subscription plan does not exist', async () => {
    await expect(
      deleteUseCase.execute({ id: 'non-existent-plan' }),
    ).rejects.toThrow(NotFoundException);
  });
});
