import { Model, DataTypes } from "sequelize";
import { Database } from "../integrations/database.js";
import constants from "../config/constants.js";
const db = Database.getSequelize();

export class BaseModel extends Model {}

BaseModel.init(
  {
    // Common fields shared by all models
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: true,
    },
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
    underscored: true, // will convert camelCase to snake_case like createdAt to created_at or updatedAt to updated_at or deletedAt to deleted_at or any other field such as sizeRange to size_range
    modelName: "BaseModel",
  }
);
