import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import cron from 'node-cron';
import TaskController from './controllers/task.controller';

const taskControllerInstance = new TaskController();

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.CONNECTION_URL!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/api', routes);
app.use(errorHandlerMiddleware);

cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('cron job called');
    taskControllerInstance.handleEndedTasks();
  } catch (error) {
    console.error('Error calling /self-trigger:', error.message);
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
