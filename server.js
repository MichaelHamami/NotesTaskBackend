const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTION_URL)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const clients = {};

// Route to handle client connections
app.get('/events', (req, res) => {
  // TODO: Add validation
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Generate a unique client ID
  const clientId = uuidv4();

  // Store the client connection
  clients[clientId] = res;

  // Send a welcome message to the client
  res.write(`data: Welcome! Your client ID is ${clientId}\n\n`);

  // Event listener for client disconnection
  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    delete clients[clientId]; // Remove the client from the connected clients
  });
});

// Route to send messages to all connected clients
app.get('/send', (req, res) => {
  const message = req.query.message;

  // Send message to all connected clients
  Object.values(clients).forEach(client => {
    client.write(`data: ${message}\n\n`);
  });

  res.send('Message sent to all clients');
});

app.use('/api', routes);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});