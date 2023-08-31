const lib = require('./../../shares/lib');
const apis= require('./apiExcute');
const callApis = (app) => {
  const { CRUD } = require("../../features/crud");
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
  array.forEach((element) => {
    let crud = new CRUD(element.nameSheet.trim());
    
    getAll(element, app, crud);
    getId(element, app, crud);
    post(element, app, crud);
    deleteId(element, app, crud);
    put(element, app, crud);
  });
apis.apis(app);
};
const getAll = (element, app, crud) => {
  app.get(`/${element.value.trim()}`, async (req, res, next) => {
    const q = req.query;
    const limit = q.limit | null;
    const offset = q.offset | null;
    res.send(await crud.getAll(limit, offset));
    next();
  });
};

const getId = (element, app, crud) => {
  app.get(`/${element.value.trim()}/:id`, async (req, res, next) => {
    const urlOriginal = req.originalUrl;

    if (urlOriginal.includes("search")) {
      const text = req.query.q;
      res.send(await crud.filters(text));
      next();
    } else {
      const id = urlOriginal.split("/")[urlOriginal.length - 1];
      res.send(await crud.getId(id));
      next();
    }
  });
};
const post = (element, app, crud) => {
 
  //crud.nameSheetTitle=element.nameSheet.trim()
 // console.log(crud.nameSheetTitle)
  app.post(`/${element.value.trim()}`, async (req, res, next) => {
    const row = req.body ? req.body : null;
    await crud.post(row);
    res.send("200");
    next();
  });
};
const put = (element, app, crud) => {
  crud.nameSheetTitle=element.nameSheet.trim()
  app.put(`/${element.value.trim()}`, async (req, res, next) => {
    const row = req.body ? req.body : null;
    //console.log(row)
    await crud.put(row);
    res.send("200");
    next();
  });
};
//
const deleteId = async (element, app, crud) => {
  app.delete(`/${element.value.trim()}/:id`, async (req, res, next) => {
    try {
      const urlOriginal = req.originalUrl.split("/"); //
      const id = urlOriginal[2];
      res.send(await crud.deleteId(id));
      next();
    } catch (error) {
      next();
      return res.send("404");
    }
  });
};
module.exports = { callApis };
