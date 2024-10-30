import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import type { PromptBuilderClient, ProtoGrpcType } from "./types";
import "dotenv/config";

// Load protobuf
const PROTO_PATH = path.join(__dirname, "prompt_builder.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

// Singleton gRPC client for PBS service
let client: PromptBuilderClient | undefined;

/**
 * Method to get the gRPC client for PBS service.
 * If the client is not already initialized, it initializes the client and returns it.
 * @returns {PromptBuilderClient} The gRPC client for PBS service.
 */
export function getPBSClient() {
  // Initialize the client if not already initialized
  if (!client) {
    // get PBS service connection address from environment variable
    const PBS_SERVICE_ADDRESS = process.env.PBS_SERVICE_ADDRESS;
    // throw error if PBS_SERVICE_ADDRESS environment variable is not set
    if (!PBS_SERVICE_ADDRESS) {
      throw new Error("PBS_SERVICE_ADDRESS environment variable is not set.");
    }
    // create gRPC client for PBS service
    client = new protoDescriptor.prompt_builder.PromptBuilder(
      PBS_SERVICE_ADDRESS,
      grpc.credentials.createInsecure()
    );
  }
  return client;
}
