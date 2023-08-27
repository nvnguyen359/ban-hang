const lib = require('./../../shares/lib')
const autoUpdater = require("./../../shares/autoUpdater");
const path = require("path");
const html_to_pdf = require("html-pdf-node");
const { print, getDefaultPrinter, getPrinters } = require("pdf-to-printer");
const fs = require("fs");
const mime = require("mime");
const apis = async (app) => {
  getListPrinter(app);
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
    //await testPrinter();
    res.send(result);
    next();
  });
  app.put("/download-order", async (req, res, next) => {
    const q = req.body ? req.body : null;
    const content = q?.content;
    const formatPage = q?.formatPage;
    const namePrinter = q?.namePrinter;
    const filePdf = await createFilePdf(content, formatPage, namePrinter);
    var filename = path.basename(filePdf.filePath);
    var mimetype = mime.getType(filePdf.filePath);
    console.log(filePdf);
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", mimetype);

    //res.send(filePdf)
    res.setHeader("Content-type", "application/pdf");
    res.download(filePdf.filePath, (err) => {
      console.log("download ", err);
    });

    // next();
  });
  app.get("/download-order1", async (req, res, next) => {
    const q = req.body ? req.body : null;
    const content = q?.content;
    const formatPage = q?.formatPage;
    const namePrinter = q?.namePrinter;
    const filePdf = await createFilePdf(content, formatPage, namePrinter);

    console.log(filePdf);

    //res.send(filePdf)
    res.setHeader("Content-type", "application/pdf");
    res.download(filePdf.filePath, (err) => {
      console.log("download ", err);
    });

    // next();
  });
  app.get("/download", async (req, res, next) => {
    const q = req.body ? req.body : null;
    const content = q?.content;
    const formatPage = q?.formatPage;
    const namePrinter = q?.namePrinter;
    const filePdf = await createFilePdf(content, formatPage, namePrinter);
    // res.download(filePdf.filePath,'report.pdf',(err)=>{
    //   if(err)
    //   console.log('download ', err)
    // });
    res.send(filePdf);
  });
  app.put("/export", (req, res, next) => {
    const q = req.body ? req.body : null;
    const content = q?.content;
    const formatPage = q?.formatPage;
    const namePrinter = q?.namePrinter;
    const filePdf = createFilePdf(content, formatPage, namePrinter);
    res.send(filePdf);
    // res.send({a:1,b:2})
    // next();
  });
  app.put("/print-order", async (req, res, next) => {
    const q = req.body ? req.body : null;
    const content = q?.content;
    const formatPage = q?.formatPage;
    const namePrinter = q?.namePrinter;
    const filePdf = await createFilePdf(content, formatPage, namePrinter);
    const options = {
      printer: namePrinter,
      printDialog: false,
      paperSize: formatPage,
      silent: true,
    };
    console.log("print ", filePdf.filePath);
    print(filePdf.filePath, options)
      .then((e) => res.send(e))
      .catch((err) => {
        console.log("err", err);
      });
  });
  app.get("/check-auto-update", async (req, res, next) => {
    res.send("");
    next();
  });
};

///===================
const createFilePdf = (content, formatPage, namePrinter) => {
  let result ={}
  let options = {};
  if (formatPage) {
    options.format = formatPage;
  }
  if (namePrinter) {
    options.printer = namePrinter;
  }
  let file = { content: "<h1>Tao file test thanh cong</h1>" };
  if (content) file.content = content;
  const fileName = "report.pdf"; // The default name the browser will use
  const filePath = false
    ? `${__dirname}/public/${fileName}`
    : `D:/public/${fileName}`;
    lib.createFolder(filePath+'/Haha')
    result ={filePath:filePath+'/Haha'}
  try {
    html_to_pdf.generatePdf(file, options).then((createBuffer) => {
     
      fs.writeFileSync(filePath, createBuffer);
      console.log('tao file thanh cong')
     
    });
    result = { fileName, filePath };
   
  } catch (error) {
    result =  { error, path: `erorr ${filePath} ` };
  }
  return result;
};
module.exports = { apis };
