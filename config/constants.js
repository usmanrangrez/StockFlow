const constants = {
  env: {
    prod: "PRODUCTION",
    dev: "DEVELOPMENT",
  },
  boolean: {
    true: "true",
    false: "false",
  },
  regex:{
    phone: /^[0-9]{10}$/,
    lettersCumNumbers: /^[a-zA-Z0-9]+$/,
  },
  db: {
    roles: {
      admin: "admin",
      manager: "manager",
      staff: "staff",
    },
    locations: {
      groundFloor: "ground_floor",
      firstFloor: "first_floor",
      secondFloor: "second_floor",
      shed: "shed",
    },
    operations:{
      increase: "increase",
      decrease: "decrease",
    },
    adminCumManager: ["admin", "manager"],
    resetPasswordRoles: ["admin"],
    getDetailsAccessRoles: ["admin"],
    adminOnly: ["admin"],
    columnNames: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
    modelTableMap: {
      user: {
        modelName: "User",
        tableName: "users",
      },
      brands: {
        modelName: "Brands",
        tableName: "brands",
      },
      products: {
        modelName: "Products",
        tableName: "products",
      },
      productsVariants: {
        modelName: "ProductsVariants",
        tableName: "products_variants",
      },
      sizes:{
        modelName: "Sizes",
        tableName: "sizes",
      },
      colors:{
        modelName: "Colors",
        tableName: "colors",
      },
      cartons:{
        modelName: "Cartons",
        tableName: "cartons",
      },
    },
  },
};

export default constants;
