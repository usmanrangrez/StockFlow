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
  },
  db: {
    roles: {
      admin: "admin",
      manager: "manager",
      staff: "staff",
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
    },
  },
};

export default constants;
