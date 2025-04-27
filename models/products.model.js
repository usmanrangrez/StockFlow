import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";
import Brand from "./brands.model.js";

const db = Database.getSequelize();

export class Products extends BaseModel {}

Products.init(
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        // Trim any leading or trailing spaces before saving
        this.setDataValue("name", value.trim());
      },
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    schema: process.env.MAIN_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    timestamps: true,
    underscored: true,
    modelName: constants.db.modelTableMap.products.modelName,
    tableName: constants.db.modelTableMap.products.tableName,
  }
);

Products.belongsTo(Brand, {
  foreignKey: "brandId",
  as: "brand",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export default Products;
