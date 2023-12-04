const { posPrintThermal, setThermal } = require("../shares/posPrinter");
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

const allApisPrinter = (app) => {
  getListPrinter(app);
  thermalPrinter(app);
};
module.exports = { getListPrinter, thermalPrinter, allApisPrinter };
