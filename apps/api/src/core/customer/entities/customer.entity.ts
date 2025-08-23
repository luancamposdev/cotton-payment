import { randomUUID } from 'node:crypto';

export interface ICustomer {
  userId: string;
  defaultAddressId?: string | null;
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

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }
}
