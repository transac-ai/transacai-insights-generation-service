import * as grpc from "@grpc/grpc-js";
import {
  getInsightsGenerationServiceDef,
  insightsGenerationHandler,
} from "./rpc/igs-service";
import { ReflectionService } from "@grpc/reflection";
import * as protoLoader from "@grpc/proto-loader";

// Create and start the gRPC server
async function startGRPCServer() {
  // get server
  const server = new grpc.Server();
  const igsServiceDef = getInsightsGenerationServiceDef();
  // add the insights generation service to the server
  server.addService(igsServiceDef.InsightsGenerationService.service, {
    generateInsights: insightsGenerationHandler,
  });
  // Add reflection service
  addReflectionService(server);
  const address = process.env.GRPC_ADDRESS || "0.0.0.0:50051";
  // if address is not provided, throw a warning
  if (!address) {
    console.warn("gRPC address is not provided. Using default address");
  }
  // bind the server to the address
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Server running at ${address}`);
  });
}

/**
 * Method to add reflection service to the gRPC server.
 * Reflections API is not enabled in production environment for security reasons.
 * @param server - gRPC server instance
 */
function addReflectionService(server: grpc.Server) {
  // if current environment is not production, add reflection service
  if (process.env.NODE_ENV !== "production") {
    // Add reflection service
    const pkg = protoLoader.loadSync(__dirname + "/rpc/igs.proto");
    const reflection = new ReflectionService(pkg);
    reflection.addToServer(server);
  }
}

// Start the gRPC server
startGRPCServer();
