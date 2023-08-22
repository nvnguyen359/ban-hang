require('dotenv').config();
const {testPrint} = require('./shares/posPrinter');
const {checkForUpdates,eventsAutoUpdate} = require('./shares/autoUpdater');
const {getPrinters} = require('./shares/lib');

const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const MainScreen = require("./screens/main/mainScreen");
const Globals = require("./globals");


const { GoogleSpreadsheet } = require('google-spreadsheet');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
let curWindow;

//Basic flags


function createWindow() {
  curWindow = new MainScreen();
  testPrint()
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
   
  });

  checkForUpdates(curWindow,app);
});

eventsAutoUpdate(curWindow,app)



//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});

(async()=>{
 console.log(await getPrinters())
})();