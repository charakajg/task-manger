import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import "./cronJobs"; 

import tasksRoute from "./routes/tasksRoute";
import recurringSchedulesRoute from "./routes/recurringSchedulesRoute";

import connectDB from "./config/db";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/tasks", tasksRoute);
app.use("/api/recurring-schedules", recurringSchedulesRoute);
app.get("*", (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  } catch (error) {
    next(error);
  }
});


const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Mongo uri ${process.env.MONGO_URI}`)
    console.log(`App listening on port ${PORT}`)
  });
});
