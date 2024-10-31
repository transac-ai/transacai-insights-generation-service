import * as grpc from "@grpc/grpc-js";

/**
 * Type definition for the InsightsGenerationRequest message
 */
export interface InsightsGenerationRequest {
  req_id: string;
  client_id: string;
  prompt_id: number;
  records_source_id: string;
  prompt_templates_source_id: string;
  from_time: string;
  to_time: string;
}

/**
 * Type definition for the InsightsGenerationResponse message
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsightsGenerationResponse {
  received: boolean;
}

/**
 * Type definition for the GenerateInsights method
 */
export interface IGenerateInsights {
  (
    call: grpc.ServerUnaryCall<
      InsightsGenerationRequest,
      InsightsGenerationResponse
    >,
    callback: grpc.sendUnaryData<InsightsGenerationResponse>
  ): void;
}

/**
 * Type definition for the InsightsGenerationService service
 */
export type InsightsGenerationService = grpc.ServiceDefinition<{
  GenerateInsights: IGenerateInsights;
}>;
