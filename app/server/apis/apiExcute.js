const lib = require("./../../shares/lib");
const initPrinter = require('./../../shares/posPrinter')
const fs = require('fs')
//const autoUpdater = require("./../../shares/autoUpdater");
const path = require("path");

//const pdf = require("html-pdf");
const PDFDocument = require("pdfkit");
const { print, getDefaultPrinter, getPrinters } = require("pdf-to-printer");

const mime = require("mime");

const apis = async (app) => {
  getListPrinter(app);
  printOrders(app)
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
const printOrders =(app)=>{
  app.get("/print-order", async (req, res, next) => {
    console.log('req.query ',req.query)
    const printerName = req.query.printerName;
    initPrinter.testPrint(printerName)
    res.send(printerName)
  });
}

///===================
const exportPdf = () => {
  const fileName = "report.pdf"; // The default name the browser will use
  const filePath = false
    ? `${__dirname}/public/${fileName}`
    : `D:/public/${fileName}`;
   

// Prepare the PDF Generation schema.
const generation = {
	html: 'template.html',
};

// Read the HTML template from disk.
const template = fs.readFileSync(path.join(__dirname,'./template.html'), { encoding: 'utf8' });
var pdf = require("pdf-creator-node");

var html =template;
var options = {
    format: "A4",
    orientation: "portrait",
    border: "8mm",
    header: {
        height: "20mm",
    },
    footer: {
        height: "20mm",
        contents: {
            default:"This is footer."
        }
    }
};
var document = {
    html: html,
    data: {},
    path: filePath,
    type: "",
  };

  pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
};
const htmlPdf =()=>{
  const html = fs.readFileSync(path.join(__dirname,'./template.html'), { encoding: 'utf8' });
  const fileName = "report.pdf"; // The default name the browser will use
  const filePath = false
    ? `${__dirname}/public/${fileName}`
    : `D:/public/${fileName}`;
    var pdf = require('html-pdf');
    pdf.create(html).toStream(function(err, stream){
      stream.pipe(fs.createWriteStream(filePath));
    });
}
const html2pdfq = ()=>{
  const html = fs.readFileSync(path.join(__dirname,'./template.html'), { encoding: 'utf8' });
  const fileName = "report.pdf"; // The default name the browser will use
  const filePath = false
    ? `${__dirname}/public/${fileName}`
    : `D:/public/${fileName}`;
const {html2pdf} = require('html2pdf.js')
html2pdf().from(html).save();
}
module.exports = { apis };
