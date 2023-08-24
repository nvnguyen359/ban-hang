const lib = require("./../../shares/lib");
const path = require('path');
const html_to_pdf = require("html-pdf-node");
const { print,getDefaultPrinter,getPrinters  } = require('pdf-to-printer');
const fs = require('fs');
const printPost = (data) => {};
const exportHtmlToPdf = (data) => {
  let options = { format: "A4" };
  let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
  html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
    const pathFile = path.resolve('./public/test.pdf');
    console.log(pathFile)
    fs.writeFileSync(pathFile,pdfBuffer);
    const options = {
        printer: 'Microsoft Print to PDF',
        printDialog:false
      };
      print(pathFile,options).then((e)=> console.log(e));
  getPrinters().then((e)=>console.log(e));
  });
};
exportHtmlToPdf();
module.exports = { exportHtmlToPdf, printPost };
