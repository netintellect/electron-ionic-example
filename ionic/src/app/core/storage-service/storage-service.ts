import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Person } from "../person";
import { Address } from "../address";
import { dispatcherApi } from "../config";

@Injectable()
export class StorageServiceProvider {
  isStorageReady = false;

  constructor(private storage: Storage) {
    storage.ready()
      .then(() => {
        this.isStorageReady = true;
        console.log(`Storage Ready. Using ${storage.driver}`)
      });
  }

  getAddress(id: string): Promise<Address> {
    return this.storage.get(id);
  }

  getAllAddresses(): Promise<Address[]> {
    let addresses: Address[] = [];
    return this.storage.forEach((v: Address, k: string, i: number) => {
      // Only push if it's an address
      if (v && v.addressStatus) {
        let a = new Address();
        Object.assign(a, v);
        addresses.push(a);
      }

    }).then(() => { return addresses; });
  }

  saveAddress(address: Address): Promise<any> {
    if (!address.id) {
      address.id = Guid.newGuid()
    }

    return this.storage.set(address.id, address);
  }

  removeAddress(address: Address): Promise<any> {
    if (address.id) {
      return this.storage.remove(address.id);
    } else {
      return Promise.reject('No such address.');
    }
  }

  async getLicense(): Promise<string> {
    const license = await this.storage.get('license');
    return license || dispatcherApi.auth;
  }

  setLicense(license): Promise<any> {
    return this.storage.set('license', license);
  }

  async getPerson(): Promise<Person> {
    const setup: Person = await this.storage.get('person');
    return setup || new Person('', '');
  }

  setPerson(person: Person): Promise<any> {
    return this.storage.set('person', person);
  }

  async getProvisionedAddressId(): Promise<string> {
    let id = await this.storage.get('provisionedAddressId');
    return id || '';
  }

  setProvisionedAddressId(id: string): Promise<any> {
    return this.storage.set('provisionedAddressId', id);
  }
}

// Pseudo Guid generator. Good enough for address.id value.
class Guid {
  static newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }
}
