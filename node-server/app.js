// // node-server/app.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import connectDB from "./config/db.js";

// // --- Routes ---
// import userRoutes from "./routes/user.route.js";
// import recipeRoutes from "./routes/recipe.route.js";
// import categoriesRoutes from "./routes/categories.route.js";

// // --- Middlewares ---
// import { pageNotFound, serverErrors } from "./middlewares/handleErrors.js";

// dotenv.config();

// const app = express();

// // --- Middleware ---
// app.use(cors());
// app.use(express.json());

// // --- תיקיית תמונות (אם אין images – תצרי אותה בתיקייה הראשית) ---
// app.use("/images", express.static(path.join(process.cwd(), "images")));

// // --- חיבור ל-MongoDB ---
// connectDB();

// // --- Routes ---
// app.use("/api/users", userRoutes);
// app.use("/api/recipes", recipeRoutes);
// app.use("/api/categories", categoriesRoutes);

// // --- Route בדיקה ---
// app.get("/", (req, res) => {
//   res.send("✅ Server is running!!!!!");
// });

// // --- טיפול בשגיאות ---
// app.use(pageNotFound);
// app.use(serverErrors);

// // --- הפעלת השרת ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";

// Routers
import userRouter from "./routes/user.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import categoryRouter from "./routes/category.routes.js";

// Middlewares
import { userAuth } from "./middlewares/userAuth.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/categories", categoryRouter);

// Error handling middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
