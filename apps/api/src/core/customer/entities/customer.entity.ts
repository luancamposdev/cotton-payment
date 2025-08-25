import { randomUUID } from 'node:crypto';

export interface ICustomer {
  userId: string;
  defaultAddressId: string | null;
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
      defaultAddressId: props.defaultAddressId ?? null,
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

  public get defaultAddressId(): string | null {
    return this.props.defaultAddressId ?? null;
  }

  public set defaultAddressId(defaultAddressId: string | null) {
    this.props.defaultAddressId = defaultAddressId;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }
}
