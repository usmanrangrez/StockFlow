import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";

const db = Database.getSequelize();

export class Sizes extends BaseModel {}

Sizes.init(
  {
    sizeRange: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    schema: process.env.MAIN_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    timestamps: true,
    underscored: true, // will convert camelCase to snake_case like sizeRange to size_range
    modelName: constants.db.modelTableMap.sizes.modelName,
    tableName: constants.db.modelTableMap.sizes.tableName,
  }
);

export default Sizes;
