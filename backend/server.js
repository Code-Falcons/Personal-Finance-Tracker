import dotenv from "@dotenvx/dotenvx";
import express from "express";
import connectMDB from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/error.js";

// import Routers
import userRouter from "./routers/userRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initilaize app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/user", userRouter);

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
