const { CRUD } = require("../features/crud");
const { CRUDKNEX } = require("../features/crudKnex");
const lib = require("../shares/lib");
const asyncData = async () => {
  return new Promise(async (res, rej) => {
    console.time();
    const crudKnex = new CRUDKNEX();
    let listTable = await crudKnex.initTable();
    if (!listTable) return;

    for (let i = 0; i < listTable.length; i++) {
      const crud = new CRUD();
      crud.nameSheet = listTable[i];
      const array = Array.from(await crud.getAll());
      const knexCrud = new CRUDKNEX(listTable[i]);
      const knexAll = await knexCrud.findAll('','*',1000000,0);
      if (array.length != knexAll.count) {
        for (let j = 0; j < array.length; j++) {
          const x = array[j];
          const findId = await knexCrud.findId(x.id);
          if (!findId) {
            await knexCrud.create(x);
          }
        }
        console.log(`===${listTable[i]}===`, "done!");
      }
    }console.timeEnd()
    res("done");
  });
  
};

module.exports = { asyncData };
