const createTableOrders = async (knex) => {
  try {
    const tbl = "Đơn Hàng";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("Id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Khách Hàng", 30);
      table.string("Tên Khách Hàng", 250);
      table.string("Trạng Thái", 250).notNullable();
      table.integer("Tiền Công", 250);
      table.integer("Chiết Khấu");
      table.integer("Phí Ship");
      table.integer("Số Lượng");
      table.datetime("Ngày Bán").notNullable();
      table.integer("Thành Tiền");
      table.integer("Thanh Toán");
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};

const createTableDetailsOrders = async (knex) => {
  try {
    const tbl = "Chi Tiết Đơn Hàng";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("Id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Sản Phẩm", 250);
      table.string("Tên Sản Phẩm", 250);
      table.integer("Số Lượng").notNullable();
      table.integer("Đơn Vị Tính");
      table.integer("Đơn giá");
      table.integer("Thành Tiền");
      table.datetime("Ngày").notNullable();
      table.integer("Giá Nhập");
      table.string("Đơn Hàng");
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};
const createTableCustomer = async (knex) => {
  try {
    const tbl = "Khách Hàng";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("Id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Tên Khách Hàng", 250);
      table.string("Phone");
      table.string("Địa Chỉ");
      table.string("Email");
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};
const createTableProduct = async (knex) => {
  try {
    const tbl = "Sản Phẩm";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("Id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Name", 250);
      table.integer("Giá Nhập");
      table.integer("Giá Bán");
      table.string("Đơn Vị Tính");
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};

const exoend = (table) => {
  table.datetime("createdAt").notNullable();
  table.datetime("updatedAt").notNullable();
};
const createInputProduct = async (knex) => {
  try {
    const tbl = "Nhập Hàng";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Tên sản phẩm", 250).notNullable();
      table.string("Sản Phẩm", 30).notNullable();
      table.integer("Số Lượng").notNullable();
      table.string("Đơn Vị Tính");
      table.integer("Giá Nhập").notNullable();
      table.integer("Giá Bán").notNullable();
      table.integer("Thành tiền").notNullable();
      table.datetime("Ngày Nhập").notNullable();
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};
const createCost = async (knex) => {
  try {
    const tbl = "Chi Phí";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Tên", 250).notNullable();
      table.integer("Số Tiền").notNullable();
      table.string("Ghi Chú");
      table.datetime("Ngày").notNullable();
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};
const createCongNoKh = async (knex) => {
  try {
    const tbl = "Chi Phí";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      return;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("Tên Khách hàng", 250).notNullable();
      table.string("Phone");
      table.integer("Số Tiền").notNullable();
      table.string("Trạng Thái").notNullable();
      table.datetime("Ngày Vay").notNullable();
      table.datetime("Ngày Trả");
      table.datetime("createdAt").notNullable();
      table.datetime("updatedAt").notNullable();
      exoend(table);
    });
  } catch (error) {
    console.error(error.message);
  }
};
const initTable = async (knex) => {
 // await createUsersTable(knex);
  await createTableOrders(knex);
  await createTableDetailsOrders(knex);
  await createTableCustomer(knex);
  await createTableProduct(knex);
  await createInputProduct(knex);
  await createCost(knex);
  await createCongNoKh(knex);
};
module.exports = { initTable };
