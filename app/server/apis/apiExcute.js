const lib = require("./../../shares/lib");
const initPrinter = require("./../../shares/posPrinter");

const fs = require("fs");
//const autoUpdater = require("./../../shares/autoUpdater");
const path = require("path");

//const pdf = require("html-pdf");
const { print, getDefaultPrinter, getPrinters } = require("pdf-to-printer");

const apis = async (app) => {
  getListPrinter(app);
  printOrders(app);
  //exportPdfKit(app);
  printPdf(app);
};
const getListPrinter = (app) => {
  app.get("/printers", async (req, res, next) => {
    let result = await getPrinters();
    const printerDefaut = await getDefaultPrinter();
    result = result.map((x) => {
      if (printerDefaut.deviceId == x.deviceId) {
        x.default = true;
      } else {
        x.default = false;
      }
      return x;
    });

    res.send(result);
    next();
  });
};

const printOrders = (app) => {
  app.put("/print-order", async (req, res, next) => {
    console.log("req.body ", req.body);
    const printerName = req.body.printerName;
    initPrinter.testPrint(printerName);
    res.send(printerName);
  });
};
const printPdf = (app) => {
  app.put("/printpdf", async (req, res, next) => {
    const query = req.body;

    console.log(query);
 
    const callBack = await lib.exportPdfFromPupetteerSync(
      query.html,
      query.idDonHang,
      query.pageSize,
      query.pathForder
    );


    const options = {
      printer: query.printerName,
    };
    var oldPath = callBack.data
    var newPath = `${query.pathForder}/${callBack.data}`
    
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('Successfully renamed - AKA moved!')
    })
   print(callBack.data, options).then(console.log);
    res.send({pa: newPath});

    //next()
  });
};
///===================

module.exports = { apis };
