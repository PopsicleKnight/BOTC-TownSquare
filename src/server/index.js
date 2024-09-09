import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { socketHandlers } from './sockets/socketHandler.js';
import { setupApiRoutes } from './routers/apiRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('Backend Port:', process.env.VITE_SERVER_BACKEND_PORT);
const port = process.env.VITE_SERVER_BACKEND_PORT || 3001;
const host = process.env.VITE_SERVER_HOST || 'http://localhost';

const app = express();
app.use(cors({
  origin: `${host}:3000`
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${host}:3000`] ,
    methods: ["GET", "POST"]
  }
})

socketHandlers(io);
setupApiRoutes(app, io);

server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

export default {
  port,
  host
}