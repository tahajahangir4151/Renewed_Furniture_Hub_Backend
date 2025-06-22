import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Furniture from "./Furniture.js";

const Cart = sequelize.define("Cart", {
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
},
    {
        tableName: "tbl_Cart",
        timestamps: true,
    }
);

Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(Furniture, { foreignKey: "productId" });

export default Cart;
