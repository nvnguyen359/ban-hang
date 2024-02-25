const {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  nativeImage,
  Tray,
  Menu,
  clipboard,
} = require("electron");
const electron = require("electron");
require("dotenv").config();
const MainScreen = require("./screens/main/mainScreen");
const Globals = require("./globals");
const { autoUpdater, AppUpdater } = require("electron-updater");
const path = require("path");
const pathServer = path.join(__dirname, "server.js");
const lib = require("./shares/lib");
const movepath = app.getPath("userData");
lib.setEnvValue("localDatabase", movepath);
let curWindow;
let tray;
//Basic flags
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  curWindow = new MainScreen();
}
let mes = "";
app.serve = require(pathServer);
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });

  autoUpdater.checkForUpdates();
  mes = `Checking for updates. Current version ${app.getVersion()}`;
  curWindow.showMessage(mes);
  lib.setEnvValue("ver", `${mes}`);
});

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  mes = `Update available. Current version ${app.getVersion()}`;
  curWindow.showMessage(mes);
  let pth = autoUpdater.downloadUpdate();
  curWindow.showMessage(pth);
  lib.setEnvValue("ver", `${mes}`);
});

autoUpdater.on("update-not-available", (info) => {
  mes = `No update available. Current version ${app.getVersion()}`;
  curWindow.showMessage(mes);
  lib.setEnvValue("ver", `${mes}`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  mes = `Update downloaded. Current version ${app.getVersion()}`;
  curWindow.showMessage(mes);
  lib.setEnvValue("ver", `${mes}`);
});

autoUpdater.on("error", (info) => {
  curWindow.showMessage(info);
});

//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});
const openWindow = () => {
  console.log("ok");
  // console.log(process.env.width,process.env.height)
  electron.BrowserWindow.getFocusedWindow().setSize(
    parseInt(process.env.width),
    parseInt(process.env.height)
  );
};
app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    let icon = nativeImage.createFromPath("./icons/electron-icon.png");
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      { label: "open", click: openWindow },
      // { label: "Item2", click: handleClick },
      // { label: "Item3", click: handleClick, checked: true },
      // { label: "Item4", click: handleClick },
    ]);
    tray.setToolTip("Hieu Ngan Store");
    tray.setContextMenu(contextMenu);
  }
});
