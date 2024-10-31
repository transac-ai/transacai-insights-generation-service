import { ZodTypeAny } from "zod";
import { defineChatEndpoint } from "@oconva/qvikchat";
import { Flow } from "@genkit-ai/flow";
import { getEndpointRunner } from "./endpoint-runner";
import { insightGenEndpointConfig } from "../endpoint-configs/insight-gen-endpoint-config";
import { setupGenkit } from "../utils/setup-genkit";
import logger from "../utils/logger";

// Singleton instance to hold the insights generation endpoint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let insightsGenEndpoint: Flow<any, ZodTypeAny, ZodTypeAny> | undefined;

// Method to get the insights generation endpoint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getInsightsGenEndpoint(): Flow<any> {
  // setup logger
  const cLog = logger.child({ context: "getInsightsGenEndpoint" });
  // ensure Genkit is setup
  setupGenkit();
  // define insights generation endpoint if not already defined
  if (!insightsGenEndpoint) {
    cLog.info(`Initializing insights generation endpoint.`);
    insightsGenEndpoint = defineChatEndpoint(insightGenEndpointConfig);
  }
  return insightsGenEndpoint;
}

/**
 * Method to generate insights from the query using LLM.
 * @param query prompt received from PBS to generate insights
 * @returns Insights generated from the query using LLM
 */
export async function generateInsights(query: string): Promise<string> {
  // Setup logger
  const cLog = logger.child({ context: "generateInsights" });
  cLog.info(`Generating insights for query.`);
  // process query and generate endpoint response
  const response = await getEndpointRunner()(getInsightsGenEndpoint(), {
    query,
  });
  // validate response
  if ("response" in response) {
    const res = response.response as string;
    if (res.length > 0) {
      return res;
    } else {
      cLog.error("Error in generating insights: Empty response");
      return "Unable to generate insights";
    }
  } else {
    if ("error" in response) {
      const error = response.error as string;
      cLog.error(`Error in generating insights: ${error}`);
      return "Unable to generate insights";
    } else {
      cLog.error(`Error in generating insights: ${JSON.stringify(response)}`);
      return "Unable to generate insights";
    }
  }
}
