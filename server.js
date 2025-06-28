import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import setupSwagger from "./swagger.js";
import open from "open";
import userRoutes from "./routes/UserRoutes.js";
import furnitureRoutes from "./routes/FurnitureRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import carouselRoutes from "./routes/CarouselRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import sequelize from "./config/db.js";
import wishlistRoutes from "./routes/WishlistRoutes.js";
import adressRoutes from "./routes/AdressRoutes.js";

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Database connected!");
    console.log("✅ Models synced");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
  }
})();

const app = express();
app.use(cors());
app.use(express.json());

//Setup Swagger Docs & api
setupSwagger(app);

app.get("/", (req, res) => {
  res.send("API is running...");
});

//Routes
app.use("/api/users", userRoutes);
app.use("/api/furniture", furnitureRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", adressRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server running on ${url}`);
});
