import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import {
  CreatePayoutRequest,
  CreatePayoutUseCase,
} from '@application/payout/use-cases/create-payout.use-case';

import { PayoutEntity } from '@core/payout/entities/payout.entity';

describe('CreatePayoutUseCase', () => {
  let payoutRepository: InMemoryPayoutRepository;
  let createPayoutUseCase: CreatePayoutUseCase;

  beforeEach(() => {
    payoutRepository = new InMemoryPayoutRepository();
    createPayoutUseCase = new CreatePayoutUseCase(payoutRepository);
  });

  it('should create a payout with minimal required data', async () => {
    const request: CreatePayoutRequest = {
      creatorPayoutConfigId: 'config-123',
      amount: 1000,
    };

    const { payout } = await createPayoutUseCase.execute(request);

    console.log(payout);

    expect(payout).toBeInstanceOf(PayoutEntity);
  });
});
