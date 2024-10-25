import { saveInsights } from "../db/insights-db";
import { generateInsights } from "../endpoints/insights-gen-endpoint";
import { informClients } from "../kafka-handlers/inform-client";
import { buildPrompt } from "../rpc-handlers/pbs";
import { InsightsGenerationRequestParams } from "../types/types";

export function insightsGenerationHandler(
  params: InsightsGenerationRequestParams
) {
  // build prompt using params
  const prompt = buildPrompt(params);
  // generate insights
  generateInsights(prompt).then((insights) => {
    // save insights to DB
    saveInsights(insights).then((insightsId) => {
      // inform clients through Kafka
      informClients({
        reqId: params.req_id,
        clientId: params.client_id,
        insightsId,
      });
    });
  });
}
