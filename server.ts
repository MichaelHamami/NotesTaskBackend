import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './src/routes';
import http from 'http';
import cors from 'cors';
import { errorHandlerMiddleware } from './src/middlewares/errorHandler';
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.CONNECTION_URL!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const clients = {};

app.use('/api', routes);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5005;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
