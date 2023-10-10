// đồng bộ dữ liệu google sheet đến  sqlite
const { delay } = require("../shares/lib");
const { CRUD } = require("./crud");
const { CRUDKNEX } = require("./crudKnex");
(async () => {
  const ct = "Sản Phẩm";
  const gg = new CRUD(ct);
  await gg.initLoad(ct);
  let array = await gg.getAll();
  console.time("time");
  const db = new CRUDKNEX(ct);
  await db.initTable();
  array = array.map((x) => {
    x["Id"] = null;
    // delete x["Ghi Chú"];
    // delete x["Giảm Giá"];
    delete x["Nhân Viên"];
    return x;
  });
  for (let i = 0; i < array.length; i++) {
    await delay(100);
    await db.upsert(array[i]);
  }

  console.timeEnd("time");
})();
