const lib = require("./../../shares/lib");
const { CRUDKNEX } = require("../../features/crudKnex");
require("colors");
const apisSqlite = (app) => {
  const array = [
    {
      nameSheet: "Sản Phẩm",
      value: "sanpham",
    },
    {
      nameSheet: "Nhập Hàng",
      value: "nhaphang",
    },
    {
      nameSheet: "Xuất hàng",
      value: "xuathang",
    },
    {
      nameSheet: "Đơn Hàng",
      value: "donhang",
    },
    {
      nameSheet: "Khách Hàng",
      value: "khachhang",
    },
    {
      nameSheet: "Chi Tiết Đơn Hàng",
      value: "chitietdonhang",
    },
    {
      nameSheet: "Chi Phí",
      value: "chiphi",
    },
    {
      nameSheet: "Nhóm",
      value: "nhom",
    },
    {
      nameSheet: "Trang Tính 11",
      value: "trangtinh11",
    },
  ];
//   array.forEach((element) => {
//     console.log(element.nameSheet.trim())
//     let crud = new CRUDKNEX(element.nameSheet.trim());
//     getAll(element, app, crud);
//   });
  let crud = new CRUDKNEX('Đơn Hàng');
  getAll('donhang', app, crud);
};
const getAll = (element, app, crud) => {
  app.get(`/api/${element}`, async (req, res, next) => {
    const q = req.query;
    const limit = q.limit | null;
    const offset = q.offset | null;
    const query = q.query|''
    res.send(await crud.getAll(limit, offset,query));
    next();
  });
};

module.exports = { apisSqlite };
