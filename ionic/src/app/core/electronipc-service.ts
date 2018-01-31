import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Address } from "./address";

@Injectable()
export class ElectronIpcService {
  constructor(private electron: ElectronService) { }

  /**
   * Sends a list of addresses to the main process, to be 
   * updated on the Locations menu.
   */
  updateLocationsMenu(addresses: Address[], provisionedId: string = '') {
    if (this.electron.ipcRenderer) {
      this.electron.ipcRenderer.send('Locations', addresses, provisionedId);
    }
  }
}
