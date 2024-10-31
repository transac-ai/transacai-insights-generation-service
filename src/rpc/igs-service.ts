import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import { insightsGenerationHandler as igsHandler } from "../core/igs-handler";

import {
  InsightsGenerationRequest,
  InsightsGenerationResponse,
  InsightsGenerationService,
} from "./types";

// Define the type for the protoDescriptor.igs object
interface ProtoDescriptor {
  InsightsGenerationRequest: object;
  InsightsGenerationResponse: object;
  InsightsGenerationService: { service: InsightsGenerationService };
}

// function to get IGS service definition
export function getInsightsGenerationServiceDef() {
  // Load the protobuf
  const PROTO_PATH = path.join(__dirname, "insights-generation-handler.proto");
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return protoDescriptor.igs as unknown as ProtoDescriptor;
}

// Validate the date-time format
function isValidDateTime(date: string) {
  return !isNaN(Date.parse(date));
}

// Implement the InsightsGenerationHandler RPC method
export function insightsGenerationHandler(
  call: grpc.ServerUnaryCall<
    InsightsGenerationRequest,
    InsightsGenerationResponse
  >,
  callback: grpc.sendUnaryData<InsightsGenerationResponse>
): void {
  // validate the request parameters
  if (!call.request.req_id) {
    return callback(new Error("req_id is required"));
  }
  if (!call.request.client_id) {
    return callback(new Error("client_id is required"));
  }
  if (call.request.prompt_id <= 0) {
    return callback(new Error("prompt_id is required"));
  }
  if (!call.request.records_source_id) {
    return callback(new Error("records_source_id is required"));
  }
  if (!call.request.prompt_templates_source_id) {
    return callback(new Error("prompt_templates_source_id is required"));
  }
  if (!call.request.from_time && isValidDateTime(call.request.from_time)) {
    return callback(new Error("from_time is required"));
  }
  if (!call.request.to_time && isValidDateTime(call.request.to_time)) {
    return callback(new Error("to_time is required"));
  }
  // call the insightsGenerationHandler function from the core
  callback(null, igsHandler(call.request));
}
