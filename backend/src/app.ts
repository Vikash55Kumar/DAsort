import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import { ApiError } from "./utility/ApiError";
import userRouter from "./router/user.router";
import jobRouter from "./router/job.router";
import datasetRouter from "./router/dataset.router";
import adminRouter from "./router/admin.router";
import analyticsRouter from "./router/analytics.router";
import utilityRouter from "./router/utility.router";
const app = express();

// CORS middleware
const frontendUrl = process.env.FRONTEND_URL
const allowedOrigins = frontendUrl ? frontendUrl.split(',').map(origin => origin.trim()) : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Add Json body parser middleware
app.use(express.json());
// Add URL encoded body parser middleware
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/datasets", datasetRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/utility", utilityRouter);









// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  
  // Handle ApiError instances
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
    return;
  }
  
  // Handle other errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
};
app.use(errorHandler);

export { app };