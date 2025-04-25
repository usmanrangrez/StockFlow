import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";

const db = Database.getSequelize();

export class Brands extends BaseModel {}

Brands.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    schema: process.env.MAIN_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    timestamps: true,
    underscored: true,
    modelName: constants.db.modelTableMap.brands.modelName,
    tableName: constants.db.modelTableMap.brands.tableName,
  }
);

export default Brands;
