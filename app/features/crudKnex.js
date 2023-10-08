require("dotenv").config({ path: "../.env" });
const { initTable } = require("./createTable");
const knex = require("knex")({
  client: "sqlite",
  connection: {
    filename: process.env.SQLITE_FILENAME,
  },
  useNullAsDefault: true,
});
class CRUDKNEX {
  constructor(table = null) {
    this.table = table;
  }
  async initTable() {
    await initTable(knex);
  }
  set setTable(table) {
    this.table = table;
  }
  get getTable() {
    return this.table;
  }
  async create(data) {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    const result = await knex(this.table).insert([data]);

    return result;
  }
  async update(data) {
    const Id = data?.Id;
    data.updatedAt = new Date();
    const result = await knex(this.table).where({ Id }).update(data);

    return result;
  }
  async upsert(data) {
    return !data.Id ? await this.create(data) : await this.update(data);
  }
  async destroy(id) {
    return await knex(this.table).where({ Id: id }).delete();
  }
  async findAll(query = "", limit = 100, offset = 0) {
    const result =
      query == ""
        ? await knex(this.table).select("*").limit(limit).offset(offset)
        : await knex.raw(query);
    //console.log(result)
    return result;
  }
  async filterQuery(query) {
    const result = await knex.raw(query);
    //console.log(result)
    return result;
  }
}

(async () => {
  let crud = new CRUDKNEX();
  await crud.initTable();
})();
module.exports = { CRUDKNEX };
