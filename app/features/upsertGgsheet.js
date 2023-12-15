// đồng bộ dữ liệu google sheet đến  sqlite
const { delay } = require("../shares/lib");
const { CRUDKNEX } = require("./crudKnex");
const { CRUD } = require("./crud");
const schedule = require("node-schedule");
const knex = require("knex");
require("colors");
const run = async () => {
  const crudKnex = new CRUDKNEX();
  crudKnex.setTable = "importGoods";
  const importGoods = await crudKnex.findAll({ limit: 100000, offset: 0 });
  crudKnex.setTable = "product";
  const products = await crudKnex.findAll({ limit: 100000, offset: 0 });
  const imports = importGoods.items;
  let dem = 0;
  const timer = 10000;
  console.log("importGoods".bgMagenta);
  for (let index = 0; index < imports.length; index++) {
    const element = imports[index];
    const productFindId = products.items.find((x) => x.name == element.name);
    if (!productFindId) {
      crudKnex.setTable = "product";
      const obj = {
        importPrice: element.importPrice,
        price: element.price,
        unit: element.unit,
        name: element.name,
      };
      const req = await crudKnex.create(obj);
      crudKnex.setTable = "product";
      element.productId = req[0].id;
      await crudKnex.update(element);
    }
    const crud = new CRUD("importGoods");
    // crud.setTable = "product";
    const findId = await crud.getId(element.id);
    console.log("#### ".bgCyan, crud.nameSheetTitle, "  #### ".bgCyan);
    if (!findId.data) {
      const result = await crud.create(element);
      console.log("tao moi", result);
    } else {
      let obj = findId.data;
      obj.productId = element.id;
      const result = await crud.put(element);
      console.log("cap nhat", result);
    }
    await delay(timer);
  }
  console.log("PRODUCT".bgMagenta);

  for (let index = 0; index < products.items.length; index++) {
    const product = products.items[index];
    let importw = imports.find(
      (x) => x.productId == "" && x.name == product.name
    );
    if (importw) {
      importw.productId = product.id;
      crudKnex.setTable = "importGoods";
      await crudKnex.update(importw);
    }
    const crud = new CRUD("product");
    console.log("#### ".bgCyan, `${crud.nameSheetTitle}`.red, "  ####".bgCyan);
    const findId = await crud.getId(product.id);
    if (!findId.data) {
      console.log(product);
      await crud.create(product);
    }
    await delay(timer);
  }
};

(async () => {
  const interval = 20 * 60 * 1000;
 // await run();
  setInterval(async () => {
    await run();
  }, interval);
})();
