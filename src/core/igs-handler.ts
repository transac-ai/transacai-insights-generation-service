import { generateInsights } from "../endpoints/insights-gen-endpoint";
import { informClients } from "../kafka/inform-client";
import { saveInsights } from "../transac-ai-services/iss/save-insights";
import { buildPrompt } from "../transac-ai-services/pbs/service";
import logger from "../utils/logger";

import {
  type GenerateInsightsRequest,
  GenerateInsightsResponse,
} from "../rpc/gen/igs/v1/transac_ai_igs_pb";
import { Code, ConnectError } from "@connectrpc/connect";

// create child logger
const cLog = logger.child({ context: "insightsGenerationHandler" });

export function insightsGenerationHandler(
  params: GenerateInsightsRequest
): GenerateInsightsResponse {
  cLog.info(
    `Received request to generate insights, request id: ${params.reqId}.`
  );
  // validate the request parameters
  const paramValidationResult = validateIGSHandlerParams(params);
  if (paramValidationResult != undefined) {
    cLog.error(
      `Invalid request parameters received for request id: ${params.reqId}. Error: ${paramValidationResult}`
    );
    throw new ConnectError(
      `Invalid request parameters. Error: ${paramValidationResult}`,
      Code.InvalidArgument
    );
  }
  // call the BuildPrompt method from the PBS gRPC service
  buildPrompt({
    req_id: params.reqId,
    client_id: params.clientId,
    prompt_id: params.promptId,
    records_source_id: params.recordsSourceId,
    prompt_templates_source_id: params.promptTemplatesSourceId,
    from_time: params.fromTime,
    to_time: params.toTime,
  })
    .then((buildPromptResponse) => {
      cLog.info(`Completed generating prompt, request id: ${params.reqId}.`);
      // check if prompt is empty
      if (!buildPromptResponse.prompt) {
        cLog.error(
          `Received empty prompt from PBS for request id: ${params.reqId}.`
        );
        return;
      }
      cLog.info(
        `Sending request to generate insights for request id: ${params.reqId}.`
      );
      // generate insights using LLM and the prompt
      generateInsights(buildPromptResponse.prompt)
        .then((insights) => {
          if (!insights) {
            cLog.error(
              `Error generating insights. Received empty insights for request id: ${params.reqId}`
            );
            return;
          }
          cLog.info(
            `Completed generating insights for request id: ${params.reqId}.`
          );
          // save insights to DB and capture the insights ID
          saveInsights({
            requestId: params.reqId,
            clientId: params.clientId,
            insights,
            fromTime: params.fromTime,
            toTime: params.toTime,
          })
            .then((insightsId) => {
              // validate the insights ID
              if (!insightsId) {
                cLog.error(
                  `Error saving insights to database for request id: ${params.reqId}.`
                );
                return;
              }
              cLog.info(
                `Insights saved to database for request id: ${params.reqId}.`
              );
              // inform clients through Kafka
              informClients({
                request_id: params.reqId,
                client_id: params.clientId,
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
  // return response
  return new GenerateInsightsResponse({ received: true });
}

/**
 * Method to validate the request parameters.
 * @param params The request parameters to validate.
 * @returns {boolean} The boolean value indicating the validation status.
 */
export function validateIGSHandlerParams(
  params: GenerateInsightsRequest
): string | undefined {
  if (!params.reqId) {
    return "req_id is required";
  }
  if (!params.clientId) {
    return "client_id is required";
  }
  if (params.promptId <= 0) {
    return "prompt_id is invalid. It should be greater than 0";
  }
  if (!params.recordsSourceId) {
    return "records_source_id is required";
  }
  if (!params.promptTemplatesSourceId) {
    return "prompt_templates_source_id is required";
  }
  if (!params.fromTime) {
    return "from_time is required";
  }
  if (!params.toTime) {
    return "to_time is required";
  }
  return undefined;
}
