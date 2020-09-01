const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron')
const {autoUpdater} = require("electron-updater");

require('update-electron-app')()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true
    },
    icon : './drakeIcon.ico'
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
    createWindow();
    autoUpdater.checkForUpdates();
    //autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  if(arg == 'visualize'){
    mainWindow.loadFile(path.join(__dirname, 'visualize.html'));
  }
  if(arg == 'add'){
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }
  if(arg == 'settings'){
    mainWindow.loadFile(path.join(__dirname, 'settings.html'));
  }
  if(arg == 'edit'){
    mainWindow.loadFile(path.join(__dirname, 'edit.html'));
  }
  if(arg == 'delete'){
    mainWindow.loadFile(path.join(__dirname, 'delete.html'));
  }
  event.returnValue = 'pong'
})