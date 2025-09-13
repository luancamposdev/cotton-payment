import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PayoutEntity } from '@core/payout/entities/payout.entity';
import { PayoutRepository } from '@core/payout/repositories/payout.repository';
import { PayoutIdVO } from '@core/payout/value-objects/payout-id.vo';
import { PayoutStatusVO } from '@core/payout/value-objects/payout-status.vo';

export interface CancelPayoutRequest {
  payoutId: string;
}

export interface CancelPayoutResponse {
  payout: PayoutEntity;
}

@Injectable()
export class CancelPayoutUseCase {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  async execute(request: CancelPayoutRequest): Promise<CancelPayoutResponse> {
    const payoutId = new PayoutIdVO(request.payoutId);
    const payout = await this.payoutRepository.findById(payoutId);

    if (!payout) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    if (payout.props.status.value === 'COMPLETED') {
      throw new BadRequestException(
        'Não é possível cancelar um pagamento já concluído. Status atual: COMPLETED.',
      );
    }

    payout.updateStatus(new PayoutStatusVO('CANCELLED'));

    await this.payoutRepository.save(payout);

    return { payout };
  }
}
