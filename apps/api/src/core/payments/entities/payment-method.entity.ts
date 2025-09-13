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
  public readonly id: string;
  private readonly props: IPaymentMethod;

  constructor(
    props: Replace<IPaymentMethod, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.validateConsistency();
  }

  // ==== GETTERS ====
  get customerId() {
    return this.props.customerId;
  }
  get provider() {
    return this.props.provider;
  }
  get providerToken() {
    return this.props.providerToken;
  }
  get brand() {
    return this.props.brand;
  }
  get last4() {
    return this.props.last4;
  }
  get expMonth() {
    return this.props.expMonth;
  }
  get expYear() {
    return this.props.expYear;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  // ==== REGRAS DE NEGÓCIO ====

  public updateProviderToken(token: string): void {
    this.updateVO('providerToken', new ProviderToken(token));
  }

  public updateCardDetails(
    brand: CardBrand | null,
    last4: Last4 | null,
    expMonth: ExpMonth | null,
    expYear: ExpYear | null,
  ): void {
    this.updateVO('brand', brand);
    this.updateVO('last4', last4);
    this.updateVO('expMonth', expMonth);
    this.updateVO('expYear', expYear);

    this.validateConsistency();
  }

  // ==== MÉTODOS INTERNOS ====

  private updateVO<K extends keyof IPaymentMethod>(
    key: K,
    value: IPaymentMethod[K],
  ): void {
    (this.props as any)[key] = value;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private validateConsistency(): void {
    // Se brand for nulo, last4/expMonth/expYear devem ser nulos também
    if (!this.props.brand) {
      if (this.props.last4 || this.props.expMonth || this.props.expYear) {
        throw new Error('Card details must be null if brand is null');
      }
    } else {
      // Se brand existe, last4, expMonth e expYear não podem ser nulos
      if (!this.props.last4 || !this.props.expMonth || !this.props.expYear) {
        throw new Error('Card details are incomplete');
      }
    }
  }

  // ==== MÉTODOS AUXILIARES ====

  public equals(other: PaymentMethodEntity): boolean {
    return this.id === other.id;
  }
}
