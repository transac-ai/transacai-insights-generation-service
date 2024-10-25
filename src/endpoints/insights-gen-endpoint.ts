import { defineChatEndpoint } from "@oconva/qvikchat";
import { insightGenEndpointConfig } from "../endpoint-configs/insight-gen-endpoint-config";
import { Flow } from "@genkit-ai/flow";
import { ZodTypeAny } from "zod";

// Singleton instance to hold the insights generation endpoint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let insightsGenEndpoint: Flow<any, ZodTypeAny, ZodTypeAny> | undefined;

// Method to get the insights generation endpoint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getInsightsGenEndpoint(): Flow<any> {
  if (!insightsGenEndpoint) {
    insightsGenEndpoint = defineChatEndpoint(insightGenEndpointConfig);
  }
  return insightsGenEndpoint;
}
