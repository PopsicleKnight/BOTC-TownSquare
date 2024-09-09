import Fastify from 'fastify';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { socketHandlers } from './sockets/socketHandler.js';
import { setupApiRoutes } from './routers/apiRoutes.js';
import fastifyCors from '@fastify/cors';
import fastifyIO from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';

// Create Fastify instance
const fastify = Fastify({ logger: true });

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist'); // Correctly join the path to 'dist'

const port = process.env.VITE_SERVER_BACKEND_PORT || 3000;
const host = process.env.VITE_SERVER_HOST || '0.0.0.0';

// Register CORS
fastify.register(fastifyCors, {
  origin: [`${host}:${port}`], // Allow frontend and backend ports
  methods: ['GET', 'POST'],
  credentials: true // Allow credentials if needed
});

// Register Socket.IO with CORS
fastify.register(fastifyIO, {
  cors: {
    origin: [`${host}:${port}`],
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
fastify.listen({ port: port, host: host }, (err, address) => {
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
