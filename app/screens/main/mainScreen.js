const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");

//console.log('tin nhan nhan duoc',socket.getMessage())
const path = require("path");

class MainScreen {
  window;

  position = {
    width: 1360,
    height: 768,
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      width: this.position.width,
      height: this.position.height,
      title: "Ứng Dụng Quản Lý Bán Hàng",
      show: true,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        devTools: false,
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
   wc.openDevTools();
    this.window.loadFile("./screens/main/dist/index.html");
    this.window.webContents.openDevTools();
  }

  showMessage(message) {
    console.log("showMessage trapped");
    console.log(message);

    this.window.webContents.send("updateMessage", message);
  }
  upData(message) {
    this.window.webContents.send("upData", message);
   
  }
 async nhanData(){
    return new Promise((res,rej)=>{
      ipcMain.once('sendData',(e,item)=>{
        res(item)
      })
    })
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
   
  }
}

module.exports = MainScreen;
