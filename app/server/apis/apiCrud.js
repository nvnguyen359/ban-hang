const lib = require("./../../shares/lib");
require("colors");
const apis = require("./apiExcute");
const callApis = (app) => {
  const { CRUD } = require("../../features/crud");
  //#region  array api
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
  //#endregion
  array.forEach((element) => {
    let crud = new CRUD(element.nameSheet.trim());
    getAll(element, app, crud);
    getId(element, app, crud);
    post(element, app, crud);
    deleteId(element, app, crud);
    put(element, app, crud);
    bulkDelete(element, app, crud);
  });
  getAlldata(app, new CRUD());
  apis.apis(app);
};
const getAlldata = (app, crud) => {
  console.log("===load all data===".green);
  // let crud = new CRUD('sanpham');
  app.get(`/all`, async (req, res, next) => {
    try {
      crud.nameSheetTitle = "Sản Phẩm";
      const sanphams = await crud.getAll();
      crud.nameSheetTitle = "Đơn Hàng";
      const donhangs = await crud.getAll();
      crud.nameSheetTitle = "Nhập Hàng";
      const nhaphangs = await crud.getAll();
      crud.nameSheetTitle = "Chi Tiết Đơn Hàng";
      const chitiets = await crud.getAll();
      crud.nameSheetTitle = "Khách Hàng";
      const khachhangs = await crud.getAll();

      const orders = donhangs.map((x) => {
        x["Ngày Bán"] = `${x["Ngày Bán"]}`.DateFormatDDMMYYY();
        x["chitiets"] = chitiets
          .filter((c) => c["Đơn Hàng"] == x["Id"])
          .map((c) => {
            c["Ngày"] = `${c["Ngày"]}`.DateFormatDDMMYYY();
            return c;
          });
        return x;
      });
      const data = {
        sanphams,
        nhaphangs,
        donhangs,
        chitiets,
        khachhangs,
        orders,
      };
      res.status(200).json(data);
      // next();
    } catch (error) {
      res.send(error);
    }
  });
};
const getDonHangs = (app, crud) => {
  app.get(`/donhangs`, async (req, res, next) => {});
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
      const id = req.params.id;
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
    res.send(await crud.post(row));
    next();
  });
};
const put = (element, app, crud) => {
  crud.nameSheetTitle = element.nameSheet.trim();
  app.put(`/${element.value.trim()}`, async (req, res, next) => {
    const row = req.body ? req.body : null;
    //console.log(row)
    res.send({ data: await crud.put(row), mes: "success" });
    next();
  });
};
//
const deleteId = async (element, app, crud) => {
  app.delete(`/${element.value.trim()}/:id`, async (req, res, next) => {
    try {
      const id = req.params.id;
      res.send(await crud.deleteId(id));
      //  next();
    } catch (error) {
      res.send(error.message);
      // next();
    }
  });
};
const bulkDelete = async (element, app, crud) => {
  app.delete(`/${element.value.trim()}`, async (req, res, next) => {
    try {
      const ids = `${req.query.ids}`.split(",");
      console.log("bulkDelete ", ids);
      await crud.bulkDelete(ids);
      res.send({ data: await crud.getAll(), mes: "success" });
      // next();
    } catch (error) {
      // next();
      return res.send({ mes: error });
    }
  });
};

module.exports = { callApis };
