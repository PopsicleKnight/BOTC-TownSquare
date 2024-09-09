import Fastify from 'fastify';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { socketHandlers } from './sockets/socketHandler.js';
import { setupApiRoutes } from './routers/apiRoutes.js';
import dotenvx from '@dotenvx/dotenvx';
import fastifyCors from '@fastify/cors';
import fastifyIO from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';

// Load environment variables
dotenvx.config();

// Create Fastify instance
const fastify = Fastify({ logger: true });

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist'); // Correctly join the path to 'dist'

const port = process.env.VITE_SERVER_BACKEND_PORT || 3001;
const host = process.env.VITE_SERVER_HOST || 'http://localhost';
const frontendPort = process.env.VITE_SERVER_FRONTEND_PORT || 3000;

// Register CORS
fastify.register(fastifyCors, {
  origin: [`${host}:${frontendPort}`, `${host}:${port}`], // Allow frontend and backend ports
  methods: ['GET', 'POST'],
  credentials: true // Allow credentials if needed
});

// Register Socket.IO with CORS
fastify.register(fastifyIO, {
  cors: {
    origin: [`${host}:${frontendPort}`, `${host}:${port}`],
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials if needed
  }
});

// Serve static files in production
if (isProduction) {
  fastify.register(fastifyStatic, {
    root: distPath,
    prefix: '/', // Serve from root
  });

  // fastify.get('/*', (req, reply) => {
  //   reply.sendFile('index.html'); // Ensure this file exists in dist
  // });
} else {
  fastify.get('/health', async (request, reply) => {
    reply.send({ status: 'ok' });
  });
}

// Register routes and handlers
fastify.ready().then(() => {
  socketHandlers(fastify);
});

setupApiRoutes(fastify);

// Start Fastify server
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
