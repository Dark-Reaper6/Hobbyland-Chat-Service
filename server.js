require("dotenv").config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const formidable = require('express-formidable');
const xss = require('xss').filterXSS;
const { ConnectDB } = require('./lib/database');
const { initSocket } = require("./src/socket");

console.log('Starting the server...\n');

const InitializeServer = async () => {
  const app = new express();
  const server = http.createServer(app);
  await initSocket(server);

  app.use(cors());
  app.use(formidable({ maxFileSize: Number.MAX_SAFE_INTEGER }));
  app.use((req, _, next) => {
    Object.keys(req.body).map(key => typeof req.body[key] === 'string' && (req.body[key] = xss(req.body[key])));
    next();
  });
  app.use("/api/message", require("./src/routes/message"));
  app.use("/api/room", require("./src/routes/room"));
  app.use("/api/event", require("./src/routes/event"));

  // initializing server
  server.listen(process.env.PORT, async () => {
    await ConnectDB();
    console.log(`✅ Server connection established at http://localhost:${process.env.PORT}`);
  });
}

InitializeServer();