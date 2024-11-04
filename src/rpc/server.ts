import { fastify } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import routes from "./routers/routes";
import { authenticator } from "./auth";
import logger from "../utils/logger";

// Setup child logger
const cLog = logger.child({ context: "startIGSServer" });

/**
 * Method to start the IGS server.
 */
export async function startIGSServer() {
  // Setup Fastify server with HTTP2 for gRPC
  const server = fastify({
    http2: true,
  });
  // Register the fastify-connect plugin
  await server.register(fastifyConnectPlugin, {
    routes, // IGS Service routes
    interceptors: [authenticator], // API key authenticator
  });
  // Add a simple health check route
  server.get("/", (_, reply) => {
    reply.type("text/plain");
    reply.send("IGS Server");
  });
  // Start the server
  await server.listen({ host: "0.0.0.0", port: 8080 });
  cLog.info("IGS server is listening at", server.addresses());
}
