import * as grpc from "@grpc/grpc-js";

// Define TypeScript types for the protoDescriptor
export interface ProtoGrpcType {
  prompt_builder: {
    PromptBuilder: {
      service: grpc.ServiceDefinition<PromptBuilderService>;
      new (
        address: string,
        credentials: grpc.ChannelCredentials,
        options?: object
      ): PromptBuilderClient;
    };
  };
}

export interface PromptBuilderService
  extends grpc.UntypedServiceImplementation {
  BuildPrompt: grpc.handleUnaryCall<BuildPromptRequest, BuildPromptResponse>;
}

export interface BuildPromptRequest {
  req_id: string;
  client_id: string;
  prompt_id: number;
  records_source_id: string;
  prompt_templates_source_id: string;
  from_time: string;
  to_time: string;
}

export interface BuildPromptResponse {
  prompt: string;
}

export interface PromptBuilderClient extends grpc.Client {
  BuildPrompt(
    request: BuildPromptRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: BuildPromptResponse
    ) => void
  ): void;
}
