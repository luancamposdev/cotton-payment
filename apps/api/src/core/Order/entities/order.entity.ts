import { randomUUID } from 'node:crypto';
import { Replace } from '@helpers/replace';

import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { AmountVO } from '@core/Order/entities/value-objects/amount.vo';
import { CurrencyVO } from '@core/Order/entities/value-objects/currency.vo';
import { PaymentStatusVO } from '@core/Order/entities/value-objects/payment-status.vo';

export interface IOrder {
  customerId: CustomerId;
  creatorId: string | null;
  amount: AmountVO;
  currency: CurrencyVO;
  description: string | null;
  status: PaymentStatusVO;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderEntity {
  private readonly _id: string;
  private props: IOrder;

  constructor(
    props: Replace<
      IOrder,
      { createdAt?: Date; updatedAt?: Date; status?: PaymentStatusVO }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      status: props.status ?? new PaymentStatusVO('PENDING'),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get customerId(): CustomerId {
    return this.props.customerId;
  }

  public get creatorId(): string | null {
    return this.props.creatorId;
  }

  public get amount(): AmountVO {
    return this.props.amount;
  }

  public get currency(): CurrencyVO {
    return this.props.currency;
  }

  public get description(): string | null {
    return this.props.description;
  }

  public get status(): PaymentStatusVO {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ==== REGRAS DE NEGÓCIO ====

  public updateStatus(newStatus: PaymentStatusVO): void {
    this.props.status = newStatus;
    this.touch();
  }

  public updateAmount(newAmount: AmountVO): void {
    this.props.amount = newAmount;
    this.touch();
  }

  public updateCurrency(newCurrency: CurrencyVO): void {
    this.props.currency = newCurrency;
    this.touch();
  }

  public updateDescription(description: string): void {
    this.props.description = description;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
