import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";

const db = Database.getSequelize();

export class Colors extends BaseModel {}

Colors.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        // Trim any leading or trailing spaces before saving
        this.setDataValue("name", value.trim());
      },
    },
  },
  {
    sequelize: db,
    schema: process.env.MAIN_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    timestamps: true,
    underscored: true,
    modelName: constants.db.modelTableMap.colors.modelName,
    tableName: constants.db.modelTableMap.colors.tableName,
  }
);

export default Colors;
