import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config();

import './cronJobs';

import tasksRoute from './routes/tasksRoute';
import recurringSchedulesRoute from './routes/recurringSchedulesRoute';

import connectDB from './config/db';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Docs', version: '1.0.0' },
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/tasks', tasksRoute);
app.use('/api/recurring-schedules', recurringSchedulesRoute);
app.get('*', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err); // Log the error for debugging purposes

  // Default error message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
});

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Mongo uri ${process.env.MONGO_URI}`);
    console.log(`App listening on port ${PORT}`);
  });
});
