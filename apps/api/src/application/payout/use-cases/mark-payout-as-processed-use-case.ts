import { Injectable, NotFoundException } from '@nestjs/common';
import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { ProviderPayoutIdVO } from '@core/payout/value-objects/provider-payout-id.vo';

export interface MarkPayoutAsProcessedRequest {
  payoutId: string;
  providerPayoutId: string;
}

export interface MarkPayoutAsProcessedResponse {
  payout: PayoutEntity;
}

@Injectable()
export class MarkPayoutAsProcessedUseCase {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  async execute(
    request: MarkPayoutAsProcessedRequest,
  ): Promise<MarkPayoutAsProcessedResponse> {
    const payoutId = new PayoutIdVO(request.payoutId);

    const payout = await this.payoutRepository.findById(payoutId);

    if (!payout) throw new NotFoundException('Pagamento não encontrado.');

    payout.markAsProcessed(new ProviderPayoutIdVO(request.providerPayoutId));

    await this.payoutRepository.save(payout);

    return { payout };
  }
}
