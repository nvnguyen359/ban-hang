const { CRUDKNEX } = require("../features/crudKnex");
const { CRUD } = require("../features/crud");
const { asyncData } = require("./../apis/asyncData");
const lib = require("../shares/lib");
const apisSqlite = async (app) => {
  createDatabase(app);
  const array = await getAllTables();
  array.forEach((element) => {
    let crud = new CRUDKNEX(element);
    findAll(element, app, crud);
    findId(element, app, crud);
    findOne(element, app, crud);
    upsert(element, app, crud);
    create(element, app, crud);
    destroy(element, app, crud);
  });
  getAllOrders(app);

  // let crud = new CRUDKNEX("Đơn Hàng");
  // getAll("donhang", app, crud);
  return app;
};
const createDatabase = (app) => {
  app.get(`/api/database`, async (req, res, next) => {
    asyncData();
    res.send({ result: "done" });
    next();
  });
};
const getAllOrders = (app) => {
  app.get(`/api/orders`, async (req, res, next) => {
    const q = req.query;
    const column = q.columns ? q.columns.split(",") : [];
    const limit = parseInt(q.pageSize) || parseInt(q.limit) || 100;
    const offset = parseInt(q.page) || 0;
    const startDay = q.startDay ? new Date(q.startDay).startDay() : null;
    const endDay = q.endDay ? new Date(q.endDay).endDay() : null;
    let crud = new CRUDKNEX("order");
    let listOrders = !startDay
      ? await crud.findAll(q.query, column, limit, offset * limit)
      : await crud.findAll(
          q.query,
          column,
          limit,
          offset * limit,
          startDay,
          endDay
        );

    let crudDetails = new CRUDKNEX("orderDetails");
    let result = [];
    for (let i = 0; i < listOrders.items.length; i++) {
      let x = listOrders.items[i];
      x.details = await crudDetails.filterWithObj({ orderId: x.id });
      result.push(x);
    }
    res.send({ count: listOrders.count, items: result });
    next();
  });
};
const upsert = (element, app, crud) => {
  app.put(`/api/${element}`, async (req, res, next) => {
    const row = req.body ? req.body : null;
    const result = await crud.upsert(row);
    res.send({ result });
    next();
    const gg = new CRUD(element);
    gg.put(row);
  });
};
const create = (element, app, crud) => {
  app.post(`/api/${element}`, async (req, res, next) => {
    let row = req.body ? req.body : null;
    const result = await crud.create(row);
    console.log(result);
    res.send({ result });
    next();
    const gg = new CRUD(element);
    gg.post(result);
  });
};

const findAll = (element, app, crud) => {
  app.get(`/api/${element}`, async (req, res, next) => {
    const q = req.query;
    const column = q.columns ? q.columns.split(",") : [];
    const limit = parseInt(q.pageSize) || parseInt(q.limit) || 100;
    const offset = parseInt(q.page) || 0;
    // console.log(limit, offset)
    res.send(await crud.findAll(q.query, column, limit, offset * limit));
    next();
  });
};
const findId = (element, app, crud) => {
  app.get(`/api/${element}/:id`, async (req, res, next) => {
    const id = req.params.id;
    res.send(await crud.findId(id));
    next();
  });
};
const findOne = (element, app, crud) => {
  app.get(`/api/${element}/obj`, async (req, res, next) => {
    const id = req.params.id;
    const result = await crud.findId(id);
    res.send(result);
    next();
  });
};
const destroy = (element, app, crud) => {
  app.delete(`/api/${element}/:id`, async (req, res, next) => {
    const id = req.params.id;
    const result = await crud.destroy(id);
    res.send({ result });
    next();
    console.log("id", id);
    const gg = new CRUD(element);
    const t = await gg.deleteId(id);
    console.log(t);
  });
};

const getAllTables = async () => {
  return new Promise(async (res, rej) => {
    let crud = new CRUDKNEX();
    const tables = await crud.initTable();
    res(tables);
  });
};

module.exports = { apisSqlite, getAllTables };
