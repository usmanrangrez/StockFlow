import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";
import Products from "./products.model.js";
import Colors from "./colors.model.js";
import Sizes from "./sizes.model.js";

const db = Database.getSequelize();

export class ProductVariants extends BaseModel {}

ProductVariants.init(
  {
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    colorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sizeRangeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
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
    modelName: constants.db.modelTableMap.productsVariants.modelName,
    tableName: constants.db.modelTableMap.productsVariants.tableName,
  }
);

// Associations
ProductVariants.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ProductVariants.belongsTo(Colors, {
  foreignKey: "colorId",
  as: "color",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

ProductVariants.belongsTo(Sizes, {
  foreignKey: "sizeRangeId",
  as: "sizeRange",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export default ProductVariants;
