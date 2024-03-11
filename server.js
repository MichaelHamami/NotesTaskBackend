const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const WebSocket = require('ws');

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const clients = {};

const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  console.log('connected');

  const tid = setTimeout(() => {
    ws.send('something');
  }, 4000);

  ws.on('message', function incoming(message, isBinary) {
    console.log(message.toString(), isBinary);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

// Route to handle client connections
app.get('/events', (req, res) => {
  console.log('events calleds');
  // TODO: Add validation
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Generate a unique client ID
  const clientId = uuidv4();
  console.log(`Client ${clientId} connected`);

  // Store the client connection
  clients[clientId] = res;

  // Send a welcome message to the client
  // res.write('event: message\n');
  // res.write('data: Welcome! Your client ID is\n\n');

  const s = setTimeout(() => {
    console.log('send welcome message');
    res.write('event: add\ndata: asdasdaelcomeYourclientIDs\n\n');
  }, 2000);

  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    delete clients[clientId]; // Remove the client from the connected clients
    res.end();
  });
});

// Route to send messages to all connected clients
app.get('/send', (req, res) => {
  const message = req.query.message;
  console.log('send this ', message);

  // Send message to all connected clients
  Object.values(clients).forEach((client, index) => {
    console.log(`Send to some client message: ${message}`);
    client.write(`data: ${message}\n\n`);
  });

  res.send('Message sent to all clients');
});

app.use('/api', routes);

const port = process.env.PORT || 5005;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
