// đồng bộ dữ liệu google sheet đến  sqlite
const { delay } = require("../shares/lib");
const { CRUDKNEX } = require("./crudKnex");
const { CRUD } = require("./crud");
const schedule = require('node-schedule');
const run = async () => {
  const crudKnex = new CRUDKNEX();
  crudKnex.setTable = "importGoods";
  const importGoods = await crudKnex.findAll({ limit: 100000, offset: 0 });
  crudKnex.setTable = "product";
  const products = await crudKnex.findAll({ limit: 100000, offset: 0 });
  const imports = importGoods.items;
  let dem = 0;
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
      await delay(500);
    }
    const crud = new CRUD("importGoods");
    // crud.setTable = "product";
    const findId = await crud.getId(element.id);
    // console.log(findId.data)
    if (!findId.data) {
      await crud.create(element);
      await delay(1500);
    } else {
      let obj = findId.data;
      obj.productId = element.id;
      await crud.put(element);
      await delay(1500);
    }
  }
  console.log("Tao moi san pham", dem);

  for (let index = 0; index < products.items.length; index++) {
    const product = products.items[index];
    let importw = imports.find(
      (x) => x.productId == "" && x.name == product.name
    );
    if (importw) {
      // console.log(importw);
      importw.productId = product.id;
      crudKnex.setTable = "importGoods";
      await crudKnex.update(importw);
    }
    const crud = new CRUD("product");
    // crud.setTable = "product";
    const findId = await crud.getId(product.id);
    // console.log(findId.data)
    if (!findId.data) {
      console.log(product);
      await crud.create(product);
      await delay(1500);
    }
  }
};
schedule.scheduleJob(
  "* */5 * * * *",()=>{
    console.log(new Date().toLocaleTimeString('vi'))
  }
);

(async () => {})();
