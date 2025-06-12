import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  profilePhoto: {
    type: Sequelize.STRING,
    defaultValue:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isBlocked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "tbl_Users",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["email"],
    },
  ],
});

export default User;
