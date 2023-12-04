const { PosPrinter } = require("electron-pos-printer");

function posPrintThermal(order) {
  let urlImg = `https://img.vietqr.io/image/VCB-0041000171668-compact2.jpg?amount=890000&amp;accountName=DO%20VAN%20HIEU&addInfo=ok`;
  const options = {
    preview: order.isPreview, //  width of content body
    margin: "0", // margin of content body
    copies: 1, // Number of copies to print
    printerName: order?.printerName || "Microsoft Print to PDF", // printerName: string, check with webContent.getPrinters()
    timeOutPerLine: 1000,
    pageSize: order?.pageSize || "80mm", // page size
  };
  const qrCode={
    type: "image",
    url: urlImg, // file path
    position: "right", // position of image: 'left' | 'center' | 'right'
    width: "160px", // width of image in px; default: auto
    height: "160px", // width of image in px; default: 50 or '50px'
  }
  const data = [
    {
      type: "table",
      style: { border: "0px solid #ddd"}, // style the table
      // list of the columns to be rendered in the table header
      // tableHeader: ["Tên", "ảnh", "Giá"],
      // multi-dimensional array depicting the rows and columns of the table body
      tableBody: [[order?.rawHtml]],
      // list of columns to be rendered in the table footer
      // tableFooter: [{ type: "text", value: "People" }, "Image"],
      // custom style for the table header
      tableHeaderStyle: {  color: "white" },
      // custom style for the table body
      tableBodyStyle: { border: "0px solid #ddd" },
      // custom style for the table footer
      tableFooterStyle: { backgroundColor: "#000", color: "white" },
    },
  ];
 
  try {
    return new Promise((res, rej) => {
      PosPrinter.print(data, options)
        .then((data) => res({data:'done'}))
        .catch((error) => {
          console.error('error',error);
          res(error);
        });
    });
  } catch (e) {
    // console.log(PosPrinter);
    console.log(e);
   return e
  }
}

module.exports = { posPrintThermal };
