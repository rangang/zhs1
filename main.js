const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

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

  const currentVersion = app.getVersion();
  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: '第一次弹窗提示',
      message: `提示1:当前版本是 ${currentVersion}，没有新版本可用。`
    });

  // 启动时检查更新
  autoUpdater.checkForUpdates();
}

// 处理更新事件
autoUpdater.on('update-available', (info) => {
  const updateVersion = info.version;

  // 弹窗提示用户
  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: '更新可用',
      message: `发现新版本 ${updateVersion}，正在下载...`
    })
    .then(() => {
      // 下载更新
      autoUpdater.downloadUpdate();
    });
});

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: '更新下载完成',
      message: '更新已下载，您可以重新启动应用程序以应用更新。'
    })
    .then(() => {
      app.quit(); // 退出应用
    });
});

// 提示当前版本号
autoUpdater.on('update-not-available', () => {
  const currentVersion = app.getVersion();
  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: '没有更新',
      message: `当前版本是 ${currentVersion}，没有新版本可用。`
    });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
