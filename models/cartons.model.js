import { DataTypes } from "sequelize";
import { BaseModel } from "./index.model.js";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";
import ProductVariants from "./productVariants.model.js";

const db = Database.getSequelize();

export class Cartons extends BaseModel {}

Cartons.init(
  {
    variantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pairsPerCarton: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.ENUM(
        constants.db.locations.groundFloor,
        constants.db.locations.firstFloor,
        constants.db.locations.secondFloor,
        constants.db.locations.shed
      ),
      allowNull: false,
    },
    totalPairs: {
      type: DataTypes.VIRTUAL, // Calculated field
      get() {
        return this.quantity * this.pairsPerCarton;
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
    modelName: constants.db.modelTableMap.cartons.modelName,
    tableName: constants.db.modelTableMap.cartons.tableName,
  }
);

// Associations
Cartons.belongsTo(ProductVariants, {
  foreignKey: "variantId",
  as: "variant",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Cartons;
