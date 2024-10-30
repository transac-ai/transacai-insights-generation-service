// Type definition for parameters of Insights Generation Service GenerateInsights method
export type InsightsGenerationRequestParams = {
  req_id: string;
  client_id: string;
  prompt_id: number;
  records_source_id: string;
  prompt_templates_source_id: string;
  from_time: string;
  to_time: string;
};

export type KafkaInsightsUpdateDataSchema = {
  reqId: string;
  clientId: string;
  insightsId: string;
};
