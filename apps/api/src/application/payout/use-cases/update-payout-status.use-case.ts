import { Injectable } from '@nestjs/common';

import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { NotFoundException } from '@nestjs/common';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';

export interface UpdatePayoutStatusRequest {
  payoutId: string;
  status: PayoutStatusVO;
}

export interface UpdatePayoutStatusResponse {
  payout: PayoutEntity;
}

@Injectable()
export class UpdatePayoutStatusUseCase {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  async execute(
    request: UpdatePayoutStatusRequest,
  ): Promise<UpdatePayoutStatusResponse> {
    const payoutId = new PayoutIdVO(request.payoutId);
    const payout = await this.payoutRepository.findById(payoutId);

    if (!payout) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    payout.updateStatus(new PayoutStatusVO(request.status.value));

    await this.payoutRepository.save(payout);

    return { payout };
  }
}
