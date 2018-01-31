import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Address } from '../core/address';
import { HomePage } from '../../pages/home/home';
import { AddressServiceProvider } from '../core/address-service/address-service';

@IonicPage()
@Component({
  selector: 'page-address-list',
  templateUrl: 'address-list.html',
})
export class AddressListPage {
  public addresses: Address[];
  provisionedAddressId: string = '';

  constructor(
    private addressService: AddressServiceProvider,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private navCtrl: NavController) { }

  async ionViewDidLoad() {
    this.loadSavedAddresses();
  }

  async loadSavedAddresses() {
    let loading = this.loadingController.create({ content: 'Loading Saved Addresses...' });
    loading.present();

    try {
      [this.addresses, this.provisionedAddressId] = await Promise.all([
        this.addressService.fetchAll(),
        this.addressService.getProvisionedAddressId()]);
    } catch (err) {
      console.error(err);
    } finally {
      loading.dismiss();
    }
  }

  edit(address: Address) {
    let modal = this.modalController.create('AddressDetailPage', { address });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.save(data);
      }
    });
  }

  add() {
    let address = new Address();
    this.edit(address);
  }

  async save(address: Address) {
    let loading = this.loadingController.create({ content: 'Saving Address...' });
    loading.present();
    try {
      await this.addressService.save(address);
      await this.loadSavedAddresses();
    } catch (err) {
      console.error(err);
    }
    finally {
      loading.dismiss();
    }
  }

  remove(address: Address) {
    const message = 'Are you sure you want to delete ' +
      `${address.name || ''} ${address.addressLine1 || ''} ${address.community || ''}?`
    
    let alert = this.alertController.create({
      title: 'Delete Address?',
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.doRemoveAddress(address)
          }
        }
      ]
    });

    alert.present();
  }

  async doRemoveAddress(address: Address) {
    let loading = this.loadingController.create({ content: 'Deleting Addresses...' });
    loading.present();

    try {
      await this.addressService.remove(address);
      await this.loadSavedAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      loading.dismiss();
    }
  }

  async selectLocation(address: Address) {
    let loading = this.loadingController.create({ content: 'Setting Your Address...' });
    loading.present();

    try {
      let isSuccessful = await this.addressService.provision(address);
      if (isSuccessful) {
        this.navCtrl.setRoot(HomePage, { address });
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      loading.dismiss();
    }
  }
}
