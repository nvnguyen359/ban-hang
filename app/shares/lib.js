const { exec } = require("child_process");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
String.prototype.removeAccents = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
String.prototype.xoaDau = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
String.prototype.convertStringVNToDateISO = function () {
  const str = this.split("/").map((x) => parseInt(x));
  let thang = str[1] < 10 ? "0" + str[1] : str[1];
  let ngay = str[0] < 10 ? "0" + str[0] : str[0];
  return str[2] + "-" + thang + "-" + ngay;
};
const getPrinters = () => {
  return new Promise((res, rej) => {
    exec("wmic printer list brief", (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        rej(err);
      }
      // list of printers with brief details
      console.log(stdout);
      // the *entire* stdout and stderr (buffered)
      stdout = stdout.split("  ");
      var printers = [];
      j = 0;
      stdout = stdout.filter((item) => item);
      for (i = 0; i < stdout.length; i++) {
        if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
          printers[j] = stdout[i + 1];
          j++;
        }
      }
      // list of only printers name

      console.log(stderr);
      res(printers);
    });
  });
};

function createIdRow(id, nameSheet, startId ) {
  if (!startId) startId = createFirstId(nameSheet);
  if (!id) {
    id = "0";
  } else {
    if (typeof id == "number") {
      id = `${startId}${id}`;
    }
  }
  const t = "000000";
  id =
    id == "0"
      ? parseInt(`${id}`.split(startId)[0])
      : parseInt(`${id}`.split(startId)[1]);
  const x = parseInt(id) + 1;
  return `${x}`.length < t.length
    ? `${startId}${t.slice(`${x}`.length)}${x}`
    : `${startId}${x}`;
}
function createFirstId(str) {
  s = "";
  Array.from(str.split(" ")).forEach((x) => {
    s += x[0];
  });
  return s.toUpperCase();
}
function createFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}
function writeFileSync(filePath, data) {
  const arr = filePath.split("/");

  const filename = arr[arr.length - 1];
  const folderName = filePath.replace(filename, "").trim();
  createFolder(folderName);
  try {
    fs.writeFileSync(filePath, data);
    return filePath;
  } catch (error) {
    return error;
  }
}
const exportPdfFromPupetteerSync = async (
  html,
  idDonHang,
  pageSize = "A6",
  rootPathExport = "D:/Don-Hang"
) => {
  console.log(new Date().toISOString())
  const date = (new Date().toISOString()).split("T")[0];
  const pathFile = `${idDonHang}_${date}.pdf`;
//${rootPathExport}/
  createFolder(rootPathExport);
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.setContent(html);
 
  await page.pdf({
    path: pathFile,
    format: pageSize,
    margin: {
      top: "20px",
      left: "20px",
      right: "20px",
      bottom: "20px",
    },
  });
  await browser.close();
  return { data: pathFile };
};
module.exports = {
  getPrinters,
  createIdRow,
  createFolder,
  writeFileSync,
  exportPdfFromPupetteerSync,
};