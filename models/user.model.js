import { Model, DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js"; 
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";

const db = Database.getSequelize();

export class User extends BaseModel {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        constants.db.roles.admin,
        constants.db.roles.manager,
        constants.db.roles.staff
      ),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize: db,
    schema: process.env.AUTH_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    deletedAt: constants.db.columnNames.deletedAt,
    timestamps: true,
    paranoid: true,
    underscored: true,
    modelName: constants.db.modelTableMap.user.modelName,
    tableName: constants.db.modelTableMap.user.tableName,
  }
);

export default User;


