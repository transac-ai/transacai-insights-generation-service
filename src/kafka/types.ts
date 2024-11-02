/**
 * Schema for posting message to `new_insights` topic
 */
export interface KafkaNewInsightsDataSchema {
  /**
   * ID of the request for which new insights have been generated
   */
  request_id: string;
  /**
   * ID of the client to which these insights belong
   */
  client_id: string;
  /**
   * ID of the insights data record that stores these newly generated insights
   */
  insights_id: string;
}
