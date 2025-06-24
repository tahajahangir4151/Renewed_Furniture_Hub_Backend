import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Furniture from "./Furniture.js";

const Wishlist = sequelize.define("Wishlist", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: "id" },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Furniture, key: "id" },
    },
},
    {
        tableName: "tbl_Wishlist",
        timestamps: true,
    }
);

Wishlist.belongsTo(User, { foreignKey: "userId" });
Wishlist.belongsTo(Furniture, { foreignKey: "productId" });

export default Wishlist;
