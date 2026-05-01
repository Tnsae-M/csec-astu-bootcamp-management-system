import cors from "cors";
import express from "express";
import path from "path";
import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";
const app = express();
//middlewars
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//routes
app.use("/api", routes);
//app.use("/api", mainRouter);

//error handling middleware


app.use(errorMiddleware);
export default app;
