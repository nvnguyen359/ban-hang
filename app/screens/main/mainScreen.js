require("dotenv").config();
const { app, BrowserWindow, ipcMain, globalShortcut,nativeImage  } = require("electron");
const path = require("path");
const remote = require('electron').remote

class MainScreen {
  window;

  position = {
    width: parseInt(process.env.width),
    height: parseInt(process.env.height),
    maximized: false,
  };
  tray;

  constructor() {
    this.window = new BrowserWindow({
      closable :false,
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
        devTools: false,
        webSecurity: false,
        preload: path.join(__dirname, "./mainPreload.js"),
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    this.handleMessages();

    let wc = this.window.webContents;
    wc.openDevTools({ mode: "undocked" });

    this.window.loadFile("./screens/main/dist/index.html");
    
  }

  showMessage(message) {
    console.log("showMessage trapped");
    console.log(message);
    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }
  minimize() {
    this.window.minimize();
  }
  maximize(){
  //  this.window.isMinimized() ? this.window.restore() : this.window.minimize()
  }
  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
  
}

module.exports = MainScreen;
