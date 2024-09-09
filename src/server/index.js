import Fastify from 'fastify';
import { socketHandlers } from './sockets/socketHandler.js';
import { setupApiRoutes } from './routers/apiRoutes.js';
import dotenv from 'dotenv';
import fastifyCors from '@fastify/cors';
import fastifyIO from "fastify-socket.io";

dotenv.config();

const port = process.env.VITE_SERVER_BACKEND_PORT || 3001;
const host = process.env.VITE_SERVER_HOST || 'http://localhost';
const frontendPort = process.env.VITE_SERVER_FRONTEND_PORT || 3000;

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyCors, {
  origin: [`${host}:${frontendPort}`],
});

fastify.register(fastifyIO, {
  cors: {
    origin: [`${host}:${frontendPort}`],
    methods: ["GET", "POST"]
  }
});

fastify.ready().then(() => {  
  socketHandlers(fastify);
  });

  setupApiRoutes(fastify);

fastify.listen({ port: port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Fastify server listening on ${address}`);
});

export default {
  port,
  host
}