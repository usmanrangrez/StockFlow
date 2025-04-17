import { Model, DataTypes } from "sequelize";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";
const db = Database.getSequelize();

export class BaseModel extends Model {}

BaseModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: true,
    },
    // Common fields shared by all models
    createdAt: {
      type: DataTypes.DATE,
      field: constants.db.columnNames.createdAt,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: constants.db.columnNames.updatedAt,
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: constants.db.columnNames.deletedAt,
    },
  },
  {
    sequelize: db,
    schema: process.env.AUTH_SCHEMA,
    timestamps: true,
    paranoid: true,
    underscored: true,
    modelName: "BaseModel",
  }
);
