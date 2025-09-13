import { Injectable, NotFoundException } from '@nestjs/common';

import { PayoutEntity } from '@core/payout/entities/payout.entity';

import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';

export interface GetPayoutByIdRequest {
  id: string;
}

export interface GetPayoutByIdResponse {
  payout: PayoutEntity;
}

@Injectable()
export class GetPayoutByIdUseCase {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  async execute(request: GetPayoutByIdRequest): Promise<GetPayoutByIdResponse> {
    const payoutId = new PayoutIdVO(request.id);

    const payout = await this.payoutRepository.findById(payoutId);

    if (!payout) throw new NotFoundException('Pagamento não encontrado.');

    return { payout };
  }
}
