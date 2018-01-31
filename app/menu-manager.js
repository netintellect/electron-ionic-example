const { Menu, MenuItem } = require('electron')

class MenuManager {
  constructor() {
    // Set default menu handler functions.
    // These can be overridden from the caller.
    this.onAbout = () => { console.log('About clicked.') }
    this.onPrefs = () => { console.log('Prefs clicked.') }
    this.onLearnMore = () => { console.log('Learn More clicked.') }
    this.onMap = () => { console.log('Map clicked.') }
    this.onLocations = () => { console.log('Locations clicked.') }
    this.onLoadLicense = () => { console.log('Load License clicked.') }
  }

  build() {
    const menu = new Menu()

    if (this.isMac()) {
      menu.append(new MenuItem(this.getMacAppMenuTemplate()))
    } else {
      menu.append(new MenuItem(this.getFileMenuTemplate()))
    }

    menu.append(new MenuItem(this.getEditMenuTemplate()))
    menu.append(new MenuItem(this.getViewMenuTemplate()))
    menu.append(new MenuItem(this.getWindowMenuTemplate()))
    menu.append(new MenuItem(this.getHelpMenuTemplate()))

    return menu;
  }

  buildTrayMenu(addresses, provisionedId, callback) {
    const menu = new Menu()
    menu.append(new MenuItem({ label: 'Map', click: this.onMap }))
    menu.append(
      new MenuItem({ label: 'View Locations', click: this.onLocations }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(this.buildLocationMenuItems(addresses, provisionedId, callback))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ role: 'quit' }))
    return menu
  }

  buildLocationMenuItems(addresses, provisionedId, callback) {
    let locationMenuItems = []

    if (addresses && addresses.length) {
      addresses.forEach((address) => {
        console.log(address)
        locationMenuItems.push(new MenuItem({
          label: `${address.addressLine1} ${address.community} ${address.state}`,
          checked: address.id === provisionedId,
          enabled: address.id !== provisionedId,
          type: 'radio',
          click: () => callback(address)
        }))
      })
    } else {
      locationMenuItems = [{
        label: 'None - Create Some Locations',
        enabled: false
      }]
    }

    const locationMenu = new MenuItem({
      label: 'Locations',
      submenu: locationMenuItems
    })

    return locationMenu
  }

  isMac() {
    return (process.platform === 'darwin')
  }

  getFileMenuTemplate() {
    return {
      label: 'File',
      submenu: [{
        label: 'Load License...',
        click: this.onLoadLicense
      }, {
        label: 'Options...',
        click: this.onPrefs
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      }]
    }
  }

  getEditMenuTemplate() {
    return {
      label: 'Edit',
      submenu: [{
        role: 'undo'
      }, {
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        role: 'cut'
      }, {
        role: 'copy'
      }, {
        role: 'paste'
      }, {
        role: 'pasteandmatchstyle'
      }, {
        role: 'delete'
      }, {
        role: 'selectall'
      }]
    }
  }

  getViewMenuTemplate() {
    return {
      label: 'View',
      submenu: [{
        label: 'Map',
        click: this.onMap,
      }, {
        label: 'Select Location',
        click: this.onLocations
      }, {
        type: 'separator'
      }, {
        role: 'reload'
      }, {
        role: 'forcereload'
      }, {
        role: 'toggledevtools'
      }, {
        type: 'separator'
      }, {
        role: 'resetzoom'
      }, {
        role: 'zoomin'
      }, {
        role: 'zoomout'
      }, {
        type: 'separator'
      }, {
        role: 'togglefullscreen'
      }]
    }
  }

  getWindowMenuTemplate() {
    const windowsSubMenu = [{
      role: 'minimize'
    }, {
      role: 'close'
    }]

    const macSubMenu = [{
      label: 'Close',
      role: 'close'
    }, {
      label: 'Minimize',
      role: 'minimize'
    }, {
      label: 'Zoom',
      role: 'zoom'
    }, {
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      role: 'front'
    }]

    return {
      role: 'window',
      submenu: this.isMac() ? macSubMenu : windowsSubMenu
    }
  }

  getHelpMenuTemplate() {
    let menu = {
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click: this.onLearnMore
      }]
    }

    if (!this.isMac()) {
      menu.submenu.unshift({ type: 'separator' })
      menu.submenu.unshift({
        label: 'About Dispatcher...',
        click: this.onAbout
      })
    }

    return menu
  }

  getMacAppMenuTemplate() {
    return {
      label: '',
      submenu: [{
        label: 'About Dispatcher',
        click: this.onAbout
      }, {
        type: 'separator'
      }, {
        label: 'Load License...',
        click: this.onLoadLicense
      }, {
        label: 'Preferences...',
        click: this.onPrefs
      }, {
        type: 'separator'
      }, {
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        role: 'hide'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      }]
    }
  }
}

module.exports = new MenuManager();
