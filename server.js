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
import sequelize from "./config/db.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");
    await sequelize.sync();
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server running on ${url}`);
});
