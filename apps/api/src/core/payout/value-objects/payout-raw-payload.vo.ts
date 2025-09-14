import { Prisma } from '@prisma/client';

export class PayoutRawPayloadVO {
  public readonly value: Record<string, any>;

  constructor(value: Prisma.JsonValue) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Invalid rawPayload');
    }

    const requiredFields = ['provider', 'transactionId', 'status'];

    for (const field of requiredFields) {
      if (!(field in value)) {
        throw new Error('rawPayload missing required fields');
      }
    }

    this.value = value;
  }
}
