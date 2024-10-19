const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
// const { updateElectronApp } = require('update-electron-app');
// updateElectronApp(); // additional configuration options available

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  const currentVersion = app.getVersion();
  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: '第一次弹窗提示',
      message: `提示1:当前版本是 ${currentVersion}，没有新版本可用。`
    });

    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, 60000)

}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Starta om applikationen för att verkställa uppdateringarna.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})
autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application')
  console.error(message)
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
