import { randomUUID } from 'node:crypto';

import { PostalCodeVo } from '@core/addresses/value-objects/postal-code.vo';
import { CountryVo } from '@core/addresses/value-objects/country.vo';
import { Replace } from '@helpers/replace';

export enum AddressType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
}

interface IAddress {
  userId: string;
  type: AddressType;
  street: string;
  number?: string | null;
  complement?: string | null;
  district?: string | null;
  state: string;
  city: string;
  postalCode: PostalCodeVo;
  country: CountryVo;
  createdAt: Date;
  updatedAt: Date;
}

export class AddressEntity {
  private readonly _id: string;
  private props: IAddress;

  constructor(
    props: Replace<
      IAddress,
      {
        postalCode: string;
        country?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      postalCode: new PostalCodeVo(props.postalCode),
      country: new CountryVo(props.country ?? 'BR'),
      district: props.district ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): AddressType {
    return this.props.type;
  }

  set type(type: AddressType) {
    this.props.type = type;
    this.touch();
  }

  get street(): string {
    return this.props.street;
  }

  set street(street: string) {
    this.props.street = street;
    this.touch();
  }

  get number(): string | null | undefined {
    return this.props.number;
  }

  set number(number: string | undefined) {
    this.props.number = number;
    this.touch();
  }

  get complement(): string | null | undefined {
    return this.props.complement;
  }

  set complement(complement: string | undefined) {
    this.props.complement = complement;
    this.touch();
  }

  get district(): string | null | undefined {
    return this.props.district;
  }

  set district(district: string) {
    this.props.district = district;
    this.touch();
  }

  get city(): string {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get state(): string {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
    this.touch();
  }

  get postalCode(): PostalCodeVo {
    return this.props.postalCode;
  }

  set postalCode(code: string | PostalCodeVo) {
    this.props.postalCode =
      code instanceof PostalCodeVo ? code : new PostalCodeVo(code);
    this.touch();
  }

  get country(): CountryVo {
    return this.props.country;
  }

  set country(country: string | CountryVo) {
    this.props.country =
      country instanceof CountryVo ? country : new CountryVo(country);
    this.touch();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
