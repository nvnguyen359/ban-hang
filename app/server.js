

require("dotenv").config();
const{testPrint} = require('./shares/posPrinter')
const path = require("path");
const {CRUD} = require('./features/crud');
//const{inPrinter}= require('./posPrinter.js')
const moment = require("moment");
let currentDate = new Date();

const format = "HH:MM:SS DD/MM/YYYY"

let formatedDate = moment(currentDate).format(format);
async function test() {
  const value = {
    "Tên Facebook": "Hỏi Dân IT",
    Email: "haryphamdev@gmail.com",
    "Số điện thoại": `'0321456789`,
    "Thời gian": formatedDate,
    "Tên khách hàng": "haaaaaaaa",
  };
  const crud = new CRUD('Trang tính11');
  await crud.create(value)
}
testPrint()
test();
