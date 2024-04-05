const express = require('express');
const http = require('http');
const cors = require('cors');
const formidable = require('express-formidable');
const routes = require('./src/routes');
const xss = require('xss').filterXSS;
const { ConnectDB } = require('./lib/connect-db');
const { initSocket } = require("./src/socket");

console.log('Starting the server...\n');

const app = new express();
const server = http.createServer(app);
await initSocket(server);

app.use(cors());
app.use(formidable({ maxFileSize: Number.MAX_SAFE_INTEGER }));
app.use((req, res, next) => {
  Object.keys(req.fields).map(key => typeof req.fields[key] === 'string' && (req.fields[key] = xss(req.fields[key])));
  next();
});
app.use('/api', routes);

// initializing server
server.listen(process.env.PORT, async () => {
  await ConnectDB();
  console.log(`✅ Server connection established at http://localhost:${process.env.PORT}`);
});
