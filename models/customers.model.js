import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";

const db = Database.getSequelize();

export class Customers extends BaseModel {}

Customers.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    district: {
      type: DataTypes.ENUM(
        constants.db.districts.BARAMULLA,
        constants.db.districts.SRINAGAR,
        constants.db.districts.ANANTNAG,
        constants.db.districts.PULWAMA,
        constants.db.districts.KUPWARA,
        constants.db.districts.BUDGAM,
        constants.db.districts.BANDIPORA,
        constants.db.districts.GANDERBAL,
        constants.db.districts.SHOPIAN,
        constants.db.districts.KULGAM
      ),
      allowNull:false
    },
  },
  {
    sequelize: db,
    schema: process.env.MAIN_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    timestamps: true,
    underscored: true,
    modelName: constants.db.modelTableMap.customers.modelName,
    tableName: constants.db.modelTableMap.customers.tableName,
  }
);

export default Customers;
