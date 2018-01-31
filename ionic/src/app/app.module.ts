import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddressServiceProvider } from './core/address-service/address-service';
import { AgmCoreModule } from '@agm/core';
import { NgxElectronModule } from 'ngx-electron';
import { SetupService } from './core/setup-service';
import { ElectronIpcService } from './core/electronipc-service';
import { DispatcherService } from './core/dispatcher-service';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageServiceProvider } from './core/storage-service/storage-service';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    AgmCoreModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__dispatcher',
      driverOrder: ['indexeddb', 'websql']
    }),
    NgxElectronModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AddressServiceProvider,
    DispatcherService,
    ElectronIpcService,
    SetupService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageServiceProvider,
    StorageServiceProvider
  ]
})
export class AppModule {}
