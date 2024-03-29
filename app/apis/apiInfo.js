const { posPrintThermal, setThermal } = require("../shares/posPrinter");
require("dotenv").config();
const lib = require("../shares/lib");
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
require("dotenv").config();
const electron = require("electron");
//const { print, getDefaultPrinter, getPrinters } = require("pdf-to-printer");
const pf = require("pdf-to-printer");
const getListPrinter = (app) => {
  app.get(`/api/printers`, async (req, res, next) => {
    res.send({
      printers: await pf.getPrinters(),
      default: await pf.getDefaultPrinter(),
    });
    next();
  });
};
const thermalPrinter = (app) => {
  app.post(`/api/printers`, async (req, res, next) => {
    //await  setThermal()
    const order = req.body;
    const result = await posPrintThermal(order);
    res.send(result);
    next();
  });
};
let demMax = 0;
const getEventWindow = (app) => {
  app.get(`/api/window/:id`, async (req, res, next) => {
    let data = "";
    const v = req.params.id;
    const w = electron.BrowserWindow.getFocusedWindow();
    switch (v) {
      case "close":
        electron.app.exit();
        break;
      case "max":
        {
          demMax++;
          if (demMax % 2 == 0) {
            w.unmaximize();
          } else {
            w.maximize();
          }
          data = "done";
        }
        break;
      case "min":
        w.hide();
        let icon = nativeImage.createFromPath("./img/electron.png");
        let tray = new Tray(icon);

        const contextMenu = Menu.buildFromTemplate([
          {
            label: "Open",
            click: () => {
              w.show();
              tray.destroy();
            },
          },
          {
            label: "Close",
            click: () => {
              electron.app.exit();
            },
          },
          // { label: "Item3", click: handleClick, checked: true },
          // { label: "Item4", click: handleClick },
        ]);
        tray.setToolTip("Hieu Ngan Store");
        tray.setContextMenu(contextMenu);
        data = "done";
        break;

      default:
        data = process.env.ver;
        break;
    }
    res.send({ data });
    next();
  });
};
const allApisPrinter = (app) => {
  getListPrinter(app);
  thermalPrinter(app);
  getEventWindow(app);
};
module.exports = { getListPrinter, thermalPrinter, allApisPrinter };
