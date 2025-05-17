const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require("electron-updater");
app.disableHardwareAcceleration();
 require("electron-reload")(
  path.join(__dirname, "copy-nest/browser"),
  {}
); 

let win;

function createWindow() {
  const indexPath = "https://copy-nest-56e1ca9f4c40.herokuapp.com/";

   win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
    }
  });
  win.setMenu(null); 
  win.loadURL(indexPath);
}


app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
}
);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
