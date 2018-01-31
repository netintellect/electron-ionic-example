const { app, BrowserWindow, dialog, ipcMain, Menu, Tray } = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')
const menuManager = require('./menu-manager')
const { autoUpdater } = require('electron-updater')

// Set up logging for updater and the app
const log = require('electron-log')
log.transports.file.level = 'info'
autoUpdater.logger = log

let win
let tray
let splashScreen

const iconPath = path.join(__dirname, 'images')
 
function initUpdater() {
 autoUpdater.on('checking-for-update', () => {
   log.info('Checking for update...')
 })
 autoUpdater.on('update-available', (ev, info) => {
   log.info('Update available.', info)
 })
 autoUpdater.on('update-not-available', (ev, info) => {
   log.info('Update not available.', info)
 })
 autoUpdater.on('error', (ev, err) => {
   log.info('Error in auto-updater.', err)
 })
 autoUpdater.on('download-progress', (progressObj) => {
   let log_message = "Download speed: " + progressObj.bytesPerSecond
   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
   log.info(log_message)
 })
 autoUpdater.on('update-downloaded', (ev, info) => {
   log.info('Update downloaded; will install in 5 seconds', info)
   autoUpdater.quitAndInstall();
 });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', appReady)

function appReady() {
  log.info(app.getPath('userData'))
  menuManager.onAbout = () => { log.info('You REALLY clicked About...') }
  menuManager.onPrefs = () => { navigate('onPrefs') }
  menuManager.onMap = () => { navigate('onMap') }
  menuManager.onLocations = () => { navigate('onLocations') }
  menuManager.onLoadLicense = onLoadLicense

  const menu = menuManager.build()
  Menu.setApplicationMenu(menu)

  // Only MacOS will have a dock property.
  if (app.dock) {
    app.dock.setIcon(path.join(iconPath, 'icon.png'))
  }

  createSplashScreen()
  initTray()
  initIpc()
  initUpdater()
  createWindow()
    .then(() => {
      if (splashScreen && splashScreen.isVisible()) {
        splashScreen.destroy()
        splashScreen = null
        autoUpdater.checkForUpdates()
       }
    })

}


function createSplashScreen() {
  splashScreen = new BrowserWindow({
    width: 1024,
    height: 576,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    closable: false,
    skipTaskbar: true,
    show: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    center: true,
    frame: false
  })

  // splashScreen.loadURL('http://localhost:8100/assets/images/sentrylitered.png')
  splashScreen.loadURL(url.format({
    pathname: path.join(__dirname,
      './www/assets/images/sentrylitered.png'),
    protocol: 'file:',
    slashes: true
  }))
}

function initTray() {
  if (process.platform === 'darwin') {
    tray = new Tray(path.join(iconPath, 'mac-tray.png'))
    tray.setPressedImage(path.join(iconPath, 'mac-tray-pressed.png'))
  } else {
    tray = new Tray(path.join(iconPath, 'icon.ico'))
  }

  tray.setToolTip(app.getName())
  tray.setContextMenu(menuManager.buildTrayMenu([], () => { }))
}

function initIpc() {
  ipcMain.on('Locations', (event, addresses, provisionedId) => {
    var newMenu = menuManager.buildTrayMenu(addresses, provisionedId, setLocation)
    tray.setContextMenu(newMenu)
  })
}

function createWindow() {
  return new Promise((resolve, reject) => {
    if (win) {
      resolve()
      return
    }

    const windowIcon = process.platform === 'darwin' ? 'icon.png' : 'icon.ico'

    // Create the browser window.
    win = new BrowserWindow({
      width: 1200,
      height: 800,
      title: 'Dispatcher',
      icon: path.join(iconPath, windowIcon),
      show: false,
      webPreferences: { webSecurity: false }
    })

    // Load the index.html of the app.
    // win.loadURL('http://localhost:8100')
    win.loadURL(url.format({
      pathname: path.join(__dirname, './www/index.html'),
      protocol: 'file:',
      slashes: true
    }))

    win.once('ready-to-show', () => {
      if (!win.isVisible()) {
        win.show()
      }

      resolve()
    })

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
      win = null
    })
  })
}

function navigate(page) {
  createWindow()
    .then(() => {
      app.focus()
      win.webContents.send(page)
    })
}

function setLocation(address) {
  log.info('You asked for address', address)
  if (!address) return;

  createWindow()
    .then(() => {
      win.webContents.send('onProvision', address)
    })
}

function onLoadLicense() {
  dialog.showOpenDialog(win, {
    title: 'Load License File',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'Text Files', extensions: ['txt', 'json', 'jwt'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  }, (files) => {
    if (files && files.length) {
      log.info(files[0])
      fs.readFile(files[0], 'utf8', function (err, data) {
        if (err) {
          return log.info(err);
        }

        win.webContents.send('license', data.trim())
        log.info(data);
      });
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  createWindow()
})
