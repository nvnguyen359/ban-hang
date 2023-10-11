require("dotenv").config({ path: "./.env" });

const path = require("path");
const pathServer = path.join(__dirname, "server/server.js");
const lib = require("./shares/lib");
const { testPrint } = require("./shares/posPrinter");
const { eventsAutoUpdate } = require("./shares/autoUpdaterJs");
const { getPrinters } = require("./shares/lib");
const { autoUpdater, AppUpdater } = require("electron-updater");
const { SocketIo } = require("./socket");
const { CRUD } = require("./features/crud");
const {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  dialog,
} = require("electron");

let mes = "";

app.serve = require(pathServer);
//require(pathServer);
const MainScreen = require(path.join(__dirname, "./screens/main/mainScreen"));
const Globals = require("./globals");

const { GoogleSpreadsheet } = require("google-spreadsheet");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
let curWindow;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

const socket = new SocketIo();
function createWindow() {
  curWindow = new MainScreen();
}
app.serve = require(pathServer);
app.whenReady().then(async () => {
  let crud = new CRUD();
  crud.nameSheetTitle = "Khách Hàng";
  const khachhangs = await crud.getAll();
  crud.nameSheetTitle = "Sản Phẩm";
  const sanphams = await crud.getAll();
  socket.sendMessage({ khachhangs, sanphams }, "all");
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
  checkUpdat();
  if ((await curWindow.nhanData()) == "install") {
    autoUpdater.quitAndInstall();
  }
});

setInterval(() => {
  checkUpdat();
}, 60000);
function checkUpdat() {
  mes = `Đang kiểm tra các bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
  console.log("dang kiem tra ban cap nhat");

  autoUpdater.checkForUpdates();
  curWindow.showMessage(mes);
  socket.sendMessage({ mes, ver: app.getVersion() });
  // autoUpdater.checkForUpdatesAndNotify();
}

/*New Update Available*/
autoUpdater.on("update-available", async (info) => {
  mes = `Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
  socket.sendMessage({ mes, ver: app.getVersion() });
  curWindow.showMessage(mes);
  let pth = await autoUpdater.downloadUpdate();
  mes = pth;
  console.log("dang tai ban cap nhat");
  socket.sendMessage({ mes, ver: app.getVersion() });
  curWindow.showMessage(mes);
});

autoUpdater.on("update-not-available", (info) => {
  mes = `Không có bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
  console.log("cap nhat co san");
  socket.sendMessage({ mes, ver: app.getVersion() });
  curWindow.showMessage(mes);
});

/*Download Completion Message*/

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  console.log("da tai ban cap nhat");
  mes = `Một phiên bản mới đã được tải xuống. Khởi động lại ứng dụng để áp dụng các bản cập nhật.`;
  socket.sendMessage({ mes, ver: app.getVersion() });
  curWindow.showMessage(mes);
  // const dialogOpts = {
  //   type: "info",
  //   buttons: ["Restart", "Later"],
  //   title: "Application Update",
  //   message: process.platform === "win32" ? releaseNotes : releaseName,
  //   detail:
  //     "Một phiên bản mới đã được tải xuống. Khởi động lại ứng dụng để áp dụng các bản cập nhật.",
  // };

  // dialog.showMessageBox(dialogOpts).then((returnValue) => {
  //   if (returnValue.response === 0) autoUpdater.quitAndInstall();
  // });
});
autoUpdater.on("error", (info) => {
  mes = info;
  socket.sendMessage({ mes, ver: app.getVersion() });
});

//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    try {
      app.quit();
    } catch (error) {
      app.quit();
    }
  }
});
console.log("path", app.getPath("userData"));
const dbFile = path.join(__dirname, "./features/adDb.db");
const movepath = app.getPath("userData");
console.log(movepath);
lib.moveFile(dbFile, movepath);
