import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { Person } from '../core/person';
import { SetupService } from '../core/setup-service';

@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {
  // Configuration Values hard-coded until we write Storage code.
  personInfo: Person = new Person('', '');

  constructor(private setupService: SetupService,
    public navCtrl: NavController,
    public navParams: NavParams) { }

  async ionViewDidLoad() {
    try {
      this.personInfo = await this.setupService.fetchPerson();
    } catch (e) {
      console.error(e);
    }
  }

  async setInfo() {
    await this.setupService.setPerson(this.personInfo)
      .catch((e) => console.error(e));

    this.navCtrl.setRoot(HomePage);
  }
}
