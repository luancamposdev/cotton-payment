import { InMemoryPayoutRepository } from '@test/in-memory-payout.repository';
import {
  CreatePayoutRequest,
  CreatePayoutUseCase,
} from '@application/payout/use-cases/create-payout.use-case';

import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';

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

    expect(payout).toBeInstanceOf(PayoutEntity);
    expect(payout.props.amount.value).toBe(1000);
    expect(payout.props.currency.value).toBe('BRL');
    expect(
      payout.props.status.equals(new PayoutStatusVO('PENDING')),
    ).toBeTruthy();
    expect(payout.props.scheduledAt).toBeNull();
    expect(payout.props.rawPayload).toBeNull();

    const stored = await payoutRepository.findById(payout.id);
    expect(stored).not.toBeNull();
    expect(stored?.id.value).toBe(payout.id.value);
  });

  it('should accept scheduledAt in the future', async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60); // +1 hora
    const request: CreatePayoutRequest = {
      creatorPayoutConfigId: 'config-123',
      amount: 2000,
      scheduleAt: futureDate,
    };

    const { payout } = await createPayoutUseCase.execute(request);

    expect(payout.props.scheduledAt!.value.getTime()).toBe(
      futureDate.getTime(),
    );
  });

  it('should accept a rawPayload object', async () => {
    const payload = {
      provider: 'mercadoPago',
      transactionId: 'tx_456',
      status: 'pending',
    };
    const request: CreatePayoutRequest = {
      creatorPayoutConfigId: 'config-123',
      amount: 3000,
      rawPayload: payload,
    };

    const { payout } = await createPayoutUseCase.execute(request);

    expect(payout.props.rawPayload!.value).toEqual(payload);
  });

  it('should throw error if amount is <= 0', async () => {
    const request: CreatePayoutRequest = {
      creatorPayoutConfigId: 'config-123',
      amount: 0,
    };

    await expect(createPayoutUseCase.execute(request)).rejects.toThrow(
      'Amount must be greater than zero',
    );
  });

  it('should throw error if creatorPayoutConfigId is missing', async () => {
    const request: Partial<CreatePayoutRequest> = { amount: 1000 };
    await expect(
      createPayoutUseCase.execute(request as CreatePayoutRequest),
    ).rejects.toThrow('CreatorPayoutConfigId is required');
  });

  it('should store multiple payouts independently', async () => {
    const request1: CreatePayoutRequest = {
      creatorPayoutConfigId: 'config-1',
      amount: 1000,
    };
    const request2: CreatePayoutRequest = {
      creatorPayoutConfigId: 'config-2',
      amount: 2000,
    };

    const { payout: payout1 } = await createPayoutUseCase.execute(request1);
    const { payout: payout2 } = await createPayoutUseCase.execute(request2);

    const all = await payoutRepository.list();
    expect(all).toHaveLength(2);
    expect(all.map((p) => p.id.value)).toEqual([
      payout1.id.value,
      payout2.id.value,
    ]);
  });
});
