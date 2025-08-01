import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./Category.js";
import User from "./User.js";
import Sale from "./Sale.js";

const Furniture = sequelize.define(
  "Furniture",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM("new", "used", "damaged"),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT, // Change to TEXT to store serialized JSON
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    saleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Sale,
        key: "id",
      },
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    noOfSold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    numberOfReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "tbl_Furnitures",
    timestamps: true,
  }
);

Furniture.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Furniture.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
Furniture.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });

export default Furniture;
