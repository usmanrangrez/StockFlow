const constants = {
  env: {
    prod: "PRODUCTION",
    dev: "DEVELOPMENT",
  },
  boolean: {
    true: "true",
    false: "false",
  },
  db: {
    roles: {
      admin: "admin",
      manager: "manager",
      sales: "sales",
    },
    rolesArray: [
      "admin",
      "manager",
      "sales",
    ],
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
    },
  },
};

export default constants;
