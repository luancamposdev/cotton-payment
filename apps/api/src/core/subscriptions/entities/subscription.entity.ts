import { randomUUID } from 'node:crypto';
import { Replace } from '@helpers/replace';

import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';

export interface ISubscription {
  customerId: string;
  planId: string;
  status: SubscriptionStatusVO;
  startDate: Date;
  endDate: Date | null;
  renewalAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionEntity {
  private readonly _id: string;
  private props: ISubscription;

  constructor(
    props: Replace<
      ISubscription,
      { createdAt?: Date; updatedAt?: Date; startDate?: Date }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      endDate: props.endDate ?? null,
      renewalAt: props.renewalAt ?? null,
      startDate: props.startDate ?? new Date(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get planId(): string {
    return this.props.planId;
  }

  get status(): SubscriptionStatusVO {
    return this.props.status;
  }
  set status(value: SubscriptionStatusVO) {
    this.props.status = value;
    this.touch();
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | null {
    return this.props.endDate;
  }
  set endDate(value: Date | null) {
    this.props.endDate = value;
    this.touch();
  }

  get renewalAt(): Date | null {
    return this.props.renewalAt;
  }
  set renewalAt(value: Date | null) {
    this.props.renewalAt = value;
    this.touch();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Atualização parcial da subscription
  updateSubscription(data: Partial<Omit<ISubscription, 'createdAt'>>) {
    this.props = { ...this.props, ...data, updatedAt: new Date() };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
