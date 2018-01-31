import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressDetailPage } from './address-detail';
import { AgmCoreModule } from '@agm/core/core.module';

@NgModule({
  declarations: [
    AddressDetailPage,
  ],
  imports: [
    AgmCoreModule,
    IonicPageModule.forChild(AddressDetailPage)
  ],
})

export class AddressDetailPageModule {}
