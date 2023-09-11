require("dotenv").config({ path: "./.env" });

const path = require("path");
const pathServer = path.join(__dirname, "server/server.js");
const lib = require("./shares/lib");
const { testPrint } = require("./shares/posPrinter");
const { eventsAutoUpdate } = require("./shares/autoUpdaterJs");
const { getPrinters } = require("./shares/lib");

const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");

app.serve = require(pathServer);
//require(pathServer);
const MainScreen = require(path.join(__dirname, "./screens/main/mainScreen"));
const Globals = require("./globals");

const { GoogleSpreadsheet } = require("google-spreadsheet");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
let curWindow;

function createWindow() {
  curWindow = new MainScreen();
  eventsAutoUpdate(app);
}
app.serve = require(pathServer);
app.whenReady().then(async () => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
  //exec(`node server/server.js`)

  //await server.initServer(app1);
});

//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});
