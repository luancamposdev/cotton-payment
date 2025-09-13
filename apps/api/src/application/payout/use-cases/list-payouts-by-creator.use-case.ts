import { Injectable } from '@nestjs/common';

import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { CreatorPayoutConfigIdVO } from '@core/payout/value-objects/creator-payout-config-id.vo';

export interface ListPayoutsByCreatorRequest {
  creatorPayoutConfigId: string;
}

export interface ListPayoutsByCreatorResponse {
  payouts: PayoutEntity[];
}

@Injectable()
export class ListPayoutsByCreatorUseCase {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  async execute(
    request: ListPayoutsByCreatorRequest,
  ): Promise<ListPayoutsByCreatorResponse> {
    const creatorId = new CreatorPayoutConfigIdVO(
      request.creatorPayoutConfigId,
    );

    const payouts =
      await this.payoutRepository.findByCreatorConfigId(creatorId);

    return { payouts };
  }
}
