const lib = require("./../../shares/lib");
const { CRUDKNEX } = require("../../features/crudKnex");
require("colors");
const apisSqlite = async (app) => {
  const array =  await getAllTables()
    array.forEach((element) => {
      console.log(element.trim())
      let crud = new CRUDKNEX(element.trim());
      getAll(element, app, crud);
    });

  // let crud = new CRUDKNEX("Đơn Hàng");
  // getAll("donhang", app, crud);
};
const getAll = (element, app, crud) => {
  app.get(`/api/${element}`, async (req, res, next) => {
    const q = req.query;
    const limit = q.limit | null;
    const offset = q.offset | null;
    const query = q.query | "";
    res.send(await crud.getAll(limit, offset, query));
    next();
  });
};
const getAllTables = async () => {
  let crud = new CRUDKNEX();
  const tables = await crud.initTable();
  return tables;
};

module.exports = { apisSqlite };
