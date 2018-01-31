import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Address } from './address';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';
import { dispatcherApi } from "./config";

@Injectable()
/**
 * A Stateless service that interacts with the Conveyant Dispatcher web service.
 */
export class DispatcherService {
  constructor(private http: Http) {
  }

  getAddressesByPhone(phone: string): Promise<Address[]> {
    const url = `${dispatcherApi.url}/GetAddressesByDid/${phone}`;

    return this.http.get(url)
      .map(x => {
        var result: Address[] = x.json();
        return result;
      })
      .catch(err => {
        if (err.status && err.status === 404) {
          return [];
        } else {
          return Observable.throw(err);
        }
      })
      .retry(2)
      .toPromise();
  }

  validateAddress(address: Address): Promise<Address> {
    const url = `${dispatcherApi.url}/ValidateAddress`;

    return this.http.post(url, address)
      .map(x => {
        let result: Address = x.json();
        return result;
      }).toPromise();
  }

  addAddress(address: Address): Promise<Address> {
    const url = `${dispatcherApi.url}/AddAddress`;

    return this.http.post(url, address)
      .map(x => {
        let result: Address = x.json();
        return result;
      }).toPromise();
  }

  async provisionAddress(address: Address, license: string): Promise<boolean> {
    const url = `${dispatcherApi.url}/ProvisionAddress`;
    var headers = new Headers();
    headers.append('Authorization', license);
    headers.append('Accept', 'application/json');

    return this.http.post(url, address.addressId, { headers: headers })
      .map(x => {
        return true;
      }).toPromise();
  }

  removeAddress(address: Address): Promise<boolean> {
    const url = `${dispatcherApi.url}/RemoveAddress/${address.addressId}`;
    return this.http.delete(url)
      .map(x => true)
      .toPromise();
  }
}
