import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectMDB from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import("./middlewares/authGoogle.js");

// import Routers
import userRouter from "./routers/userRouter.js";
import transactionRouter from "./routers/transactionRouter.js";
import budgetRouter from "./routers/budgetRouter.js";
import authRouter from "./routers/authRouter.js";
import savingRouter from "./routers/savingRouter.js";
import protectedRoutes from "./middlewares/authMiddleware.js";
import categoryRouter from "./routers/categoryRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initilaize app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", //FE
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", protectedRoutes, userRouter);
app.use("/api/transactions", protectedRoutes, transactionRouter);
// app.use("/api/category", protectedRoutes, categoryRouter);
app.use("/api/category", categoryRouter);

app.use("/api/budgets", protectedRoutes, budgetRouter);

app.use("/api/savings", protectedRoutes, savingRouter);

// Mock Frontned button  - google oauth2 section
app.get("/api/google", (req, res) => {
  res.send('<a href="/api/auth/toAuth">Authenticate with Google</a>');
});

// Error handler middlewares
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 8000;
async function startServer() {
  await connectMDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
