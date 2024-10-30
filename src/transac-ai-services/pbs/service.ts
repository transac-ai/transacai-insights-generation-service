import * as grpc from "@grpc/grpc-js";
import type { BuildPromptRequest, BuildPromptResponse } from "./types";
import { getPBSClient } from "./client";

/**
 * Method to build prompt using the given request parameters.
 *
 * Expected input:
 * {
 *  req_id: string;
 *  client_id: string;
 *  prompt_id: number;
 *  records_source_id: string;
 *  prompt_templates_source_id: string;
 *  from_time: string;
 *  to_time: string;
 * }
 *
 * @param {BuildPromptRequest} requestParams The request parameters to build prompt.
 * @returns {Promise<BuildPromptResponse>} The response containing the built prompt.
 */
export function buildPrompt(
  requestParams: BuildPromptRequest
): Promise<BuildPromptResponse> {
  // Return a promise to build prompt
  return new Promise((resolve, reject) => {
    // Get the PBS service client and call the BuildPrompt method
    getPBSClient().BuildPrompt(
      requestParams,
      (error: grpc.ServiceError | null, response: BuildPromptResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
}
