import { randomUUID } from 'node:crypto';

import { Replace } from '@helpers/replace';

import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { ProviderToken } from '@core/payments/value-objects/provider-token.vo';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { Last4 } from '@core/payments/value-objects/last4.vo';
import { ExpMonth } from '@core/payments/value-objects/exp-month.vo';
import { ExpYear } from '@core/payments/value-objects/exp-year.vo';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  PICPAY = 'PICPAY',
  MERCADOPAGO = 'MERCADOPAGO',
}

export interface IPaymentMethod {
  customerId: CustomerId;
  provider: PaymentProvider;
  providerToken: ProviderToken;
  brand: CardBrand | null;
  last4: Last4 | null;
  expMonth: ExpMonth | null;
  expYear: ExpYear | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentMethodEntity {
  private readonly _id: string;
  private props: IPaymentMethod;

  constructor(
    props: Replace<IPaymentMethod, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
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

  public get provider(): PaymentProvider {
    return this.props.provider;
  }

  public get providerToken(): ProviderToken {
    return this.props.providerToken;
  }

  public get brand(): CardBrand | null {
    return this.props.brand;
  }

  public get last4(): Last4 | null {
    return this.props.last4;
  }

  public get expMonth(): ExpMonth | null {
    return this.props.expMonth;
  }

  public get expYear(): ExpYear | null {
    return this.props.expYear;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ==== REGRAS DE NEGÓCIO ====

  public updateProviderToken(token: string): void {
    this.props.providerToken = new ProviderToken(token);
    this.touch();
  }

  public updateBrand(brand: CardBrand): void {
    this.props.brand = new CardBrand(brand.value);
    this.touch();
  }

  public updateLast4(last4: string): void {
    this.props.last4 = new Last4(last4);
    this.touch();
  }

  public updateExpMonth(month: number): void {
    this.props.expMonth = new ExpMonth(month);
    this.touch();
  }

  public updateExpYear(year: number): void {
    this.props.expYear = new ExpYear(year);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
