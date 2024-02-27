require("dotenv").config();
require("colors");
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  nativeImage,
} = require("electron");
const path = require("path");

class MainScreen {
  window;

  position = {
    width: parseInt(process.env.width) || 1360,
    height: parseInt(process.env.height) || 768,
    maximized: false,
  };
  tray;

  constructor() {
    this.window = new BrowserWindow({
      closable: false,
      width: this.position.width,
      height: this.position.height,
      title: "This is a test application",
      show: true,
      frame: false,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      fullscreenable: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: true,
        enableRemoteModule: true, 
        devTools: false,
        preload: path.join(__dirname, "./mainPreload.js"),
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();
      this.window.webContents.openDevTools();
      if (this.position.maximized) {
        this.window.maximize();
      }
    });
    this.window.loadFile("./screens/main/dist/index.html");
  }

  showMessage(message) {
    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }
  minimize() {
    this.window.minimize();
  }
  maximize() {
    //  this.window.isMinimized() ? this.window.restore() : this.window.minimize()
  }
  hide() {
    this.window.hide();
  }
}

module.exports = MainScreen;
