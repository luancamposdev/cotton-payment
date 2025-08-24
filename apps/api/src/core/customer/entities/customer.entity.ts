import { randomUUID } from 'node:crypto';
import { AddressEntity } from '@core/addresses/entities/address.entity';

export interface ICustomer {
  userId: string;
  defaultAddressId?: string | null;
  defaultAddress?: AddressEntity | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CustomerEntity {
  private readonly _id: string;
  private props: ICustomer;
  constructor(props: ICustomer, id?: string) {
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

  public get userId(): string {
    return this.props.userId;
  }

  public get defaultAddressId(): string | null | undefined {
    return this.props.defaultAddressId;
  }

  public set defaultAddressId(defaultAddressId: string | null | undefined) {
    this.props.defaultAddressId = defaultAddressId;
    this.props.updatedAt = new Date();
  }

  get defaultAddress() {
    return this.props.defaultAddress ?? null;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }
}
