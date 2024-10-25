import { InsightsGenerationRequestParams } from "../types/types";

export function buildPrompt(params: InsightsGenerationRequestParams) {
  return params.client_id;
}
