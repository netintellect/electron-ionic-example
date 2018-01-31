import { Injectable } from '@angular/core';
import { Address } from '../address';
import { DispatcherService } from '../dispatcher-service';
import { ElectronIpcService } from '../electronipc-service';
import { StorageServiceProvider } from '../storage-service/storage-service';
import * as _ from "lodash";

@Injectable()
export class AddressServiceProvider {
  constructor(
    private dispatcher: DispatcherService,
    private ipc: ElectronIpcService,
    private storage: StorageServiceProvider) {
  }

  async fetchAll(): Promise<Address[]> {
    // Get all from dispatcher and combine that list with the local list
    const person = await this.storage.getPerson();

    // Set up the two promises, letting them run in parallel, awaiting the return of both.
    let [remoteAddresses, localAddresses] = await Promise.all([
      this.dispatcher.getAddressesByPhone(person.phone),
      this.storage.getAllAddresses()]);

    // Combine the local stored addresses with the remote ones. They could have been added elsewhere. 
    // We cannot rely on the dispatcher's addressId, because it isn't truly an identifier.
    // We have to rely on comparing the two addresses based on certain fields, as implemented in Address.equals.
    let result = _.unionWith(localAddresses, remoteAddresses, Address.equals);

    // Remember, provisioning can occur outside of the app. ONE of the remote addresses might already be provisioned.
    let provisionedAddress = _.find(remoteAddresses, (x) => x.addressStatus === 'PROVISIONED');
    if (provisionedAddress) {
      // Now find the matching address in the combined list
      let provisionedId = '';
      let matching = _.find(result, (o) => { return Address.equals(provisionedAddress, o) });
      if (matching) {
        provisionedId = matching.id;
        await this.storage.setProvisionedAddressId(provisionedId);
        this.ipc.updateLocationsMenu(result || [], provisionedId);
      }
    } else {
      this.ipc.updateLocationsMenu(result || []);
    }

    return result;
  }

  validate(address: Address): Promise<Address> {
    return this.dispatcher.validateAddress(address);
  }

  save(address: Address): Promise<Address> {
    return this.storage.saveAddress(address);
  }

  getProvisionedAddressId(): Promise<string> {
    return this.storage.getProvisionedAddressId();
  }

  async provision(address: Address): Promise<boolean> {
    // We need to get the person and license objects.
    let [person, license] = await Promise.all([
      this.storage.getPerson(),
      this.storage.getLicense()
    ]);

    // Make sure we have a valid person/endpoint on the address.
    address.endpoint = {
      callerName: person.name,
      did: person.phone
    };

    // Tell the dispatcher about the address and provision it.
    let dispatcherAddress = await this.dispatcher.addAddress(address);

    const success = await this.dispatcher.provisionAddress(dispatcherAddress, license);

    if (success) {
      // Copy any normalized info from dispatcher into the address object.
      Object.assign(address, dispatcherAddress);

      // Remember when we provisioned it last.
      let now = new Date();
      address.lastUsed = now.toLocaleString();

      // Save the updated address and the provisioned id.
      await Promise.all([
        this.storage.setProvisionedAddressId(address.id),
        this.storage.saveAddress(address)]);

      return true;
    }

    return success;
  }

  remove(address: Address): Promise<boolean> {
    return this.storage.removeAddress(address);
  }
}
