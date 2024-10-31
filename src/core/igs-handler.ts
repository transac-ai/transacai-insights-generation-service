import { generateInsights } from "../endpoints/insights-gen-endpoint";
import { informClients } from "../kafka/inform-client";
import {
  InsightsGenerationRequest,
  InsightsGenerationResponse,
} from "../rpc/types";
import { saveInsights } from "../transac-ai-services/iss/save-insights";
import { buildPrompt } from "../transac-ai-services/pbs/service";
import logger from "../utils/logger";

export function insightsGenerationHandler(
  params: InsightsGenerationRequest
): InsightsGenerationResponse {
  // create child logger
  const cLog = logger.child({ context: "insightsGenerationHandler" });
  cLog.info(
    `Received request to generate insights, request id: ${params.req_id}.`
  );
  // call the BuildPrompt method from the PBS gRPC service
  buildPrompt(params)
    .then((buildPromptResponse) => {
      cLog.info(`Completed generating prompt, request id: ${params.req_id}.`);
      // check if prompt is empty
      if (!buildPromptResponse.prompt) {
        cLog.error(
          `Received empty prompt from PBS for request id: ${params.req_id}.`
        );
        return;
      }
      cLog.info(
        `Sending request to generate insights for request id: ${params.req_id}.`
      );
      // generate insights using LLM and the prompt
      generateInsights(buildPromptResponse.prompt)
        .then((insights) => {
          if (!insights) {
            cLog.error(
              `Error generating insights. Received empty insights for request id: ${params.req_id}`
            );
            return;
          }
          cLog.info(
            `Completed generating insights for request id: ${params.req_id}.`
          );
          // save insights to DB and capture the insights ID
          saveInsights({
            requestId: params.req_id,
            clientId: params.client_id,
            insights,
            fromTime: params.from_time,
            toTime: params.to_time,
          })
            .then((insightsId) => {
              // validate the insights ID
              if (!insightsId) {
                cLog.error(
                  `Error saving insights to database for request id: ${params.req_id}.`
                );
                return;
              }
              cLog.info(
                `Insights saved to database for request id: ${params.req_id}.`
              );
              // inform clients through Kafka
              informClients({
                request_id: params.req_id,
                client_id: params.client_id,
                insights_id: insightsId,
              });
            })
            .catch((error) => {
              cLog.error("Error saving insights to database: ", error);
              return;
            });
        })
        .catch((error) => {
          cLog.error(
            "Error generating insights. Received empty insights: ",
            error
          );
          return;
        });
    })
    .catch((error) => {
      cLog.error(
        "Error generating prompt. Received empty prompt from PBS: ",
        error
      );
      return;
    });
  return { received: true };
}
