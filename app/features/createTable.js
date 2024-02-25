const { delay } = require("./../shares/lib");
const createTableOrders = async (knex) => {
  try {
    const tbl = "order";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("customerId", 30);
      table.string("name", 250);
      table.string("status", 250).notNullable();
      table.integer("wage", 250);
      table.integer("discount");
      table.integer("shippingFee");
      table.integer("quantity");
      table.integer("intoMney");
      table.integer("pay");
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const createTableDetailsOrders = async (knex) => {
  try {
    const tbl = "orderDetails";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      // console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("productId", 250);
      table.string("name", 250);
      table.integer("quantity").notNullable();
      table.integer("unit");
      table.integer("price");
      table.integer("intoMoney");
      table.integer("importPrice");
      table.string("orderId");
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createTableCustomer = async (knex) => {
  try {
    const tbl = "customer";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      // console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250);
      table.string("phone");
      table.string("address");
      table.string("email");
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createTableProduct = async (knex) => {
  try {
    const tbl = "product";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250);
      table.integer("importPrice");
      table.integer("price");
      table.string("unit");
      exoend(table);
    });
    //console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const exoend = (table) => {
  table.datetime("createdAt").notNullable();
  table.datetime("updatedAt");
};
const createInputProduct = async (knex) => {
  try {
    const tbl = "importGoods";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250).notNullable();
      table.string("productId", 30).notNullable();
      table.integer("quantity").notNullable();
      table.string("unit");
      table.integer("importPrice").notNullable();
      table.integer("price").notNullable();
      table.integer("intoMoney").notNullable();
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createCost = async (knex) => {
  try {
    const tbl = "expense";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250).notNullable();
      table.integer("money").notNullable();
      table.string("note");
      exoend(table);
    });
    //console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createCongNoKh = async (knex) => {
  try {
    const tbl = "debt";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      // console.log("tao column");

      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250).notNullable();
      table.string("phone");
      table.integer("money").notNullable();
      table.string("status").notNullable();
      table.datetime("loanDate").notNullable();
      table.datetime("payDate");
      exoend(table);
    });

    //console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const setting = async (knex) => {
  try {
    const tbl = "setting";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name");
      table.string("jsonData");
      exoend(table);
    });

    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const initTable = async (knex) => {
  return new Promise(async (res, rej) => {
    let tables = [];
    // await createUsersTable(knex);
    let tb = await createTableOrders(knex);
    tables.push(tb);
    tb = await createTableDetailsOrders(knex);
    tables.push(tb);
    tb = await createTableCustomer(knex);
    tables.push(tb);
    tb = await createTableProduct(knex);
    tables.push(tb);
    tb = await createInputProduct(knex);
    tables.push(tb);
    tb = await createCost(knex);
    tables.push(tb);
    tb = await createCongNoKh(knex);
    tables.push(tb);
    tb = await setting(knex);
    tables.push(tb);
    res(tables);
    await afterTableDebt(knex);
  });
};
const afterTableDebt = async (knex) => {
  await knex.schema.alterTable("debt", async (table) => {
    knex.schema.hasColumn("debt", "payDay").then((exists) => {
      if (exists) {
        table.dropColumn("payDay");
        table.string("payDate");
      }
    });
    knex.schema.hasColumn("debt", "kh_ncc").then((exists) => {
      if (exists) {
        table.string("kh_ncc");
      }
    });
    // knex.schema.hasColumn("store", "value").then((exists) => {
    //   if (exists) {
    //     table.string("value");
    //   }
    // });
  });
};
module.exports = { initTable };
