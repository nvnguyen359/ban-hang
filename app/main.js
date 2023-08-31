require("dotenv").config({ path: './.env' });

const path = require("path");
const pathServer = path.join(__dirname, "server/server.js");
const lib = require('./shares/lib');
const { testPrint } = require("./shares/posPrinter");
const { checkForUpdates, eventsAutoUpdate } = require("./shares/autoUpdater");
const { getPrinters } = require("./shares/lib");

const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");

app.serve = require(pathServer);
//require(pathServer);
const MainScreen = require(path.join(__dirname,"./screens/main/mainScreen"));
const Globals = require("./globals");

const { GoogleSpreadsheet } = require("google-spreadsheet");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
let curWindow;

function createWindow() {
  curWindow = new MainScreen();
  //process.noAsar = true;
  //localStorage.setItem('userData',app.getPath('userData'))
}
app.serve = require(pathServer);
app.whenReady().then(async() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
 //exec(`node server/server.js`)

//await server.initServer(app1);
  checkForUpdates(curWindow, app);
});

eventsAutoUpdate(curWindow, app);

//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});
ipcMain.on("sendData", (event, data) => {
  console.log(data);
  testPrint();
});
//app.server = server.initServer(app1);
(async () => {
  //console.log(await getPrinters())
})();
