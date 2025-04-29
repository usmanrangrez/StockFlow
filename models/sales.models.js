import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";
import { DataTypes } from "sequelize";
import ProductVariants from "./productVariants.model.js";

const db = Database.getSequelize();

export class Sales extends BaseModel {}

Sales.init(
  {
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productVariantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soldBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalMrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalSellingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    schema: process.env.MAIN_SCHEMA,
    createdAt: constants.db.columnNames.createdAt,
    updatedAt: constants.db.columnNames.updatedAt,
    deletedAt: constants.db.columnNames.deletedAt,
    paranoid: true,
    timestamps: true,
    underscored: true,
    modelName: constants.db.modelTableMap.sales.modelName,
    tableName: constants.db.modelTableMap.sales.tableName,
  }
);


Sales.belongsTo(ProductVariants, {
  foreignKey: "productVariantId",
  as: "variant",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Sales;
