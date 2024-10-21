const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// 设置日志记录
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// 主窗口
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  checkForUpdates();
});

// 检查更新
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '更新可用',
      message: `新版本可用: ${info.version}。应用将下载并安装更新。`,
    });
  });

  autoUpdater.on('update-not-available', () => {
    const currentVersion = app.getVersion();
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '没有更新',
      message: `当前版本是 ${currentVersion}，没有新版本可用。`,
    });
  });

  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('更新错误', error == null ? '未知' : error.toString());
  });

  autoUpdater.on('download-progress', (progress) => {
    let logMessage = `下载速度: ${progress.bytesPerSecond} - 已下载 ${progress.percent}% (${progress.transferred}/${progress.total})`;
    log.info(logMessage);
  });

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: '更新可用',
        message: '更新已下载，应用将重启并安装更新。',
      })
      .then(() => {
        autoUpdater.quitAndInstall();
      });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
