import { randomUUID } from 'node:crypto';

import { Replace } from '@helpers/replace';

import { SubscriptionNameVo } from '@core/subscription-plans/value-objects/subscription-plan/subscription-name.vo';
import { PriceVO } from '@core/subscription-plans/value-objects/subscription-plan/price.vo';
import { CurrencyVO } from '@core/subscription-plans/value-objects/subscription-plan/currency.vo';
import { BillingIntervalVO } from '@core/subscription-plans/value-objects/subscription-plan/billing-interval.vo';
import { TrialDaysVO } from '@core/subscription-plans/value-objects/subscription-plan/trial-days.vo';

export interface ISubscriptionPlan {
  creatorId: string;
  name: SubscriptionNameVo;
  description: string | null;
  price: PriceVO;
  currency: CurrencyVO;
  billingInterval: BillingIntervalVO;
  trialDays: TrialDaysVO | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionPlanEntity {
  private readonly _id: string;
  private props: ISubscriptionPlan;

  constructor(
    props: Replace<ISubscriptionPlan, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      description: props.description ?? null,
      trialDays: props.trialDays ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string {
    return this._id;
  }

  get creatorId(): string {
    return this.props.creatorId;
  }

  get name(): SubscriptionNameVo {
    return this.props.name;
  }
  set name(value: SubscriptionNameVo) {
    this.props.name = value;
    this.touch();
  }

  get description(): string | null {
    return this.props.description;
  }

  set description(value: string | null) {
    this.props.description = value;
    this.touch();
  }

  get price(): PriceVO {
    return this.props.price;
  }
  set price(value: PriceVO) {
    this.props.price = value;
    this.touch();
  }

  get currency(): CurrencyVO {
    return this.props.currency;
  }

  set currency(value: CurrencyVO) {
    this.props.currency = value;
    this.touch();
  }

  get billingInterval(): BillingIntervalVO {
    return this.props.billingInterval;
  }

  set billingInterval(value: BillingIntervalVO) {
    this.props.billingInterval = value;
    this.touch();
  }

  get trialDays(): TrialDaysVO | null {
    return this.props.trialDays;
  }
  set trialDays(value: TrialDaysVO | null) {
    this.props.trialDays = value;
    this.touch();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updatePlan(data: Partial<Omit<ISubscriptionPlan, 'createdAt'>>) {
    this.props = { ...this.props, ...data, updatedAt: new Date() };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
