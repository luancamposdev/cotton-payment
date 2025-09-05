import { randomUUID } from 'node:crypto';
import { Replace } from '@helpers/replace';

import { SubscriptionStatusVO } from '@core/subscriptions/value-objects/subscription-status.vo';
import { SubscriptionPlanEntity } from '@core/subscription-plans/entities/subscription-plan.entity';

export interface ISubscription {
  customerId: string;
  planId: string;
  status: SubscriptionStatusVO;
  startDate: Date;
  trialEndsAt: Date | null;
  endDate: Date | null;
  renewalAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionEntity {
  private readonly _id: string;
  private props: ISubscription;

  public constructor(
    props: Replace<
      ISubscription,
      { createdAt?: Date; updatedAt?: Date; startDate?: Date }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      startDate: props.startDate ?? new Date(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      trialEndsAt: props.trialEndsAt ?? null,
      endDate: props.endDate ?? null,
      renewalAt: props.renewalAt ?? null,
    };
    this.checkStatusAutomatically();
  }

  static createFromPlan(
    customerId: string,
    plan: SubscriptionPlanEntity,
  ): SubscriptionEntity {
    const now = new Date();
    let trialEndsAt: Date | null = null;
    let status: SubscriptionStatusVO = new SubscriptionStatusVO('PENDING');

    if (plan.trialDays?.hasTrial()) {
      trialEndsAt = new Date(now);
      trialEndsAt.setDate(trialEndsAt.getDate() + plan.trialDays.value);
      status = new SubscriptionStatusVO('TRIAL');
    }

    return new SubscriptionEntity({
      customerId,
      planId: plan.id,
      status,
      startDate: now,
      trialEndsAt,
      endDate: null,
      renewalAt: null,
    });
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
    this.checkStatusAutomatically();
    return this.props.status;
  }

  set status(value: SubscriptionStatusVO) {
    this.props.status = value;
    this.touch();
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get trialEndsAt(): Date | null {
    return this.props.trialEndsAt;
  }

  get endDate(): Date | null {
    return this.props.endDate;
  }

  set endDate(value: Date | null) {
    this.props.endDate = value;
    this.touch();
    this.checkStatusAutomatically();
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

  updateSubscription(data: Partial<Omit<ISubscription, 'createdAt'>>) {
    this.props = { ...this.props, ...data, updatedAt: new Date() };
    this.checkStatusAutomatically();
  }

  private checkStatusAutomatically(): void {
    const now = new Date();
    const current = this.props.status.value;

    // estados que não devem ser sobrescritos automaticamente
    if (current === 'CANCELLED') return;
    if (current === 'PENDING') return;

    // ainda não começou
    if (this.props.startDate > now) return;

    // expirado por data de término
    if (this.props.endDate !== null && now > this.props.endDate) {
      if (current !== 'EXPIRED') {
        this.props.status = new SubscriptionStatusVO('EXPIRED');
        this.touch();
      }
      return;
    }

    // período de trial
    if (this.props.trialEndsAt !== null && now < this.props.trialEndsAt) {
      if (current !== 'TRIAL') {
        this.props.status = new SubscriptionStatusVO('TRIAL');
        this.touch();
      }
      return;
    }

    if (current !== 'ACTIVE') {
      this.props.status = new SubscriptionStatusVO('ACTIVE');
      this.touch();
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
