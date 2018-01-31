import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
import { AddressServiceProvider } from '../core/address-service/address-service';
import { Address } from '../core/address';

@IonicPage()
@Component({
  selector: 'page-address-detail',
  templateUrl: 'address-detail.html',
})

export class AddressDetailPage {
  public address = new Address();
  public iconList = [
    'home',
    'basket',
    'beer',
    'boat',
    'bonfire',
    'briefcase',
    'cafe',
    'plane',
    'medkit',
    'restaurant'
  ];

  formErrors: string;
  addressForm: FormGroup;

  constructor(public addressService: AddressServiceProvider,
    private viewCtrl: ViewController,
    navParams: NavParams,
    builder: FormBuilder) {

    // Copy the properties - don't just assign the reference
    Object.assign(this.address, navParams.data.address);

    // Make sure the validation function has access to "this"
    this.validateAddress = this.validateAddress.bind(this);

    this.addressForm = builder.group({
      addressId: [this.address.addressId],
      addressStatus: [this.address.addressStatus],
      icon: [this.address.icon],
      name: [this.address.name],
      addressLine2: [this.address.addressLine2],
      addressLine1: [this.address.addressLine1, Validators.required],
      community: [this.address.community, Validators.required],
      state: [this.address.state, [Validators.required, Validators.pattern(/[a-zA-Z]{2}/)]],
      postalCode: [this.address.postalCode, [Validators.required, Validators.pattern(/\d{5}/)]]
    }, { asyncValidator: this.validateAddress });
  }

  private validateTimeout;

  validateAddress(form: FormGroup): Promise<ValidationErrors> {
    clearTimeout(this.validateTimeout);
    return new Promise((resolve, reject) => {
      this.validateTimeout = setTimeout(() => {
        this.addressService.validate(form.value)
          .then(data => {
            Object.assign(this.address, data);
            this.address.name = form.get('name').value;
            this.address.icon = form.get('icon').value;
            resolve(null);
          })
          .catch(err => {
            let error = JSON.parse(err._body);
            this.formErrors = error.message;
            resolve(error.message);
          });
      }, 750);
    });
  }

  getLatitude(): number {
    return this.address.addressStatus ? Number(this.address.latitude) : 0;
  }

  getLongitude(): number {
    return this.address.addressStatus ? Number(this.address.longitude) : 0;
  }

  save() {
    this.viewCtrl.dismiss(this.address);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
