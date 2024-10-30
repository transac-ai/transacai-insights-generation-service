import { generateInsights } from "../endpoints/insights-gen-endpoint";
import { informClients } from "../kafka-handlers/inform-client";
import { saveInsights } from "../transac-ai-services/iss/save-insights";
import { buildPrompt } from "../transac-ai-services/pbs/service";
import { InsightsGenerationRequestParams } from "../types/types";

export async function insightsGenerationHandler(
  params: InsightsGenerationRequestParams
) {
  // call the BuildPrompt method from the PBS gRPC service
  const buildPromptResponse = await buildPrompt(params);
  console.log("Prompt: ", buildPromptResponse.prompt);
  // check if prompt is empty
  if (!buildPromptResponse.prompt) {
    throw new Error("Error generating prompt. Received empty prompt from PBS.");
  }
  // generate insights using LLM and the prompt
  generateInsights(buildPromptResponse.prompt).then((insights) => {
    // save insights to DB and capture the insights ID
    saveInsights({
      requestId: params.req_id,
      clientId: params.client_id,
      insights,
      fromTime: params.from_time,
      toTime: params.to_time,
    }).then((insightsId) => {
      // inform clients through Kafka
      informClients({
        reqId: params.req_id,
        clientId: params.client_id,
        insightsId,
      });
    });
  });
}
