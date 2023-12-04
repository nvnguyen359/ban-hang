const path = require("path");
require("dotenv").config();
const lib = require("./../shares/lib");
const { initTable } = require("./createTable");
class CRUDKNEX {
  knex;
  constructor(table = null) {
    this.table = table;
    const localDatabase =
      process.env.EVN_NODE != "production"
        ? path.join(__dirname, process.env.SQLITE_FILENAME)
        : path.join(process.env.localDatabase, process.env.SQLITE_FILENAME);
    this.knex = require("knex")({
      client: "sqlite",
      connection: {
        filename: localDatabase,
      },
      useNullAsDefault: true,
    });
  }
  async initTable() {
    return await initTable(this.knex);
  }
  set setTable(table) {
    this.table = table;
  }
  get getTable() {
    return this.table;
  }
  async create(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (data.lenght < 1) return { result: [] };
    let data1 = Array.from(data).map((x) => {
      if (!x.createdAt) x.createdAt = new Date().toISOString();
      if (!x.updatedAt) x.updatedAt = new Date().toISOString();
      return x;
    });
    try {
      const result = await this.knex(this.table).insert(data1).returning("*");
      return result;
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
  async update(data) {
    const id = data?.id;
    data.updatedAt = new Date().toISOString();
    try {
      const result = await this.knex(this.table)
        .where({ id })
        .update(data)
        .returning("*");
      return result;
    } catch (error) {
      return { error };
    }
  }
  async upsert(data) {
    let id = null;
    if (Array.isArray(data)) {
      id = Array.from(data)[0];
    } else {
      id = data.id;
    }
    return id ? await this.update(data) : await this.create(data);
  }
  async destroy(id) {
    const result = await this.knex(this.table)
      .del()
      .where({ id })
      .returning("*");
    // console.log("id ", id, this.table, result);
    return result;
  }
  async findAll(
    query = "",
    column = null,
    limit,
    offset = 0,
    startDay,
    endDay
  ) {
    if (!column) column = "*";
    return new Promise(async (res, rej) => {
     // console.log(new Date(startDay).toISOString(),new Date(endDay).toLocaleDateString('vi'))
      const orderBy = "id";
      let qr = !startDay
        ? await this.knex
            .columns(column)
            .select()
            .limit(limit)
            .offset(offset)
            .from(this.table)
            .orderBy(orderBy, "desc")
        : await this.knex(this.table)
            .whereBetween("createdAt", [new Date(startDay).toISOString(), new Date(endDay).toISOString()])
            .columns(column)
            .select()
            .limit(limit)
            .offset(offset)
            .orderBy(orderBy, "desc");
      const result =
        query == ""
          ? qr
          : !offset
          ? await this.knex
              .raw(query + ` limit ${limit} offset ${offset}`)
              .orderBy(orderBy, "desc")
          : await knex.raw(query);
      this.knex(this.table)
        .count("id as CNT")
        .then((total) => {
          res({ items: result, count: total[0].CNT });
        });
    });
  }
  async findId(id) {
    return await this.knex(this.table).where({ id }).first();
  }
  async filterWithObj(obj) {
    return await this.knex(this.table).where(obj);
  }
  async findOne(obj) {
    return await this.knex(this.table).where(obj).first();
  }
  async filterQuery(query) {
    const result = await this.knex.raw(query);
    //console.log(result)
    return result;
  }
}
// (async()=>{
//   let crud = new CRUDKNEX('Đơn Hàng');
//   await crud.getAll()
// })()
module.exports = { CRUDKNEX };
