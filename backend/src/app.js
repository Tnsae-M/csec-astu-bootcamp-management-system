import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";
const app = express();
//middlewars
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
//routes
app.use("/api", routes);

//error handling middleware
app.use(errorMiddleware);
export default app;
