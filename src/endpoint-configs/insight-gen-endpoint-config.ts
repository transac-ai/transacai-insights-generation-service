import { ChatEndpointConfig } from "@oconva/qvikchat";
import { getInsightGenSystemPrompt } from "../prompts/insight-gen-prompts";

export const insightGenEndpointConfig: ChatEndpointConfig = {
  endpoint: "insight-gen",
  systemPrompt: getInsightGenSystemPrompt(),
};
