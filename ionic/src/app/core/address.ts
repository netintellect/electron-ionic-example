import { Endpoint } from "./endpoint";

export class Address {
  // These fields come from the Dispatcher API
  public id: string = '';
  public addressId: number | string = 0;
  public addressLine1: string = '';
  public addressLine2: string = '';
  public houseNumber: string = '';
  public prefixDirectional: string = '';
  public streetName: string = ''
  public community: string = '';
  public state: string = '';
  public longitude: string = '';
  public latitude: string = '';
  public postalCode: string = '';
  public zipPlusFour: string = '';
  public addressStatus: string = '';
  public endpoint: Endpoint;

  // These fields are local app enhancements
  public name: string = '';
  public lastUsed: string = '';
  public icon: string = '';

  constructor(addressLine1: string = '', addressLine2: string = '',
    community: string = '', state: string = '', postalCode: string = '',
    longitude: string = '', latitude: string = '', name: string = '', icon: string = ''
  ) {
    this.name = name;
    this.icon = icon;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.community = community;
    this.state = state;
    this.postalCode = postalCode;
    this.longitude = longitude;
    this.latitude = latitude;
  }

  toString(): string {
    let result = `${this.addressLine1 || ''} ${this.addressLine2 || ''} ${this.community || ''}, ${this.state || ''} ${this.postalCode || ''}`;
    return result;
  }

  static equals(a1: Address, a2: Address) {
    return Address.fieldEquals(a1.addressLine1, a2.addressLine1)
     && Address.fieldEquals(a1.addressLine2, a2.addressLine2)
     && Address.fieldEquals(a1.community, a2.community)
     && Address.fieldEquals(a1.state, a2.state)
     && Address.fieldEquals(a1.postalCode, a2.postalCode);
  }

 static fieldEquals(field1: string, field2:string) {
    return (field1 || '').toLocaleUpperCase().trim() === (field2 || '').toLocaleUpperCase().trim();
  }
}
