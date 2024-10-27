/**
 * Type definition for data required to save insights to database.
 *
 * @property {string} requestId - Request ID for which insights are generated
 * @property {string} clientId - Client ID for which insights are generated
 * @property {string} insights - Insights generated from the query using LLM
 * @property {string} fromTime - Start time of the transactional data for which insights are generated
 * @property {string} toTime - End time of the transactional data for which insights are generated
 */
export type SaveInsightsParams = {
  requestId: string;
  clientId: string;
  insights: string;
  fromTime: string;
  toTime: string;
};

/**
 * Method to save insights to the database.
 * @param params - Data required to save insights to database
 * @returns ID of the saved insights
 */
export async function saveInsights(
  params: SaveInsightsParams
): Promise<string> {
  // save insights to DB
  return params.insights;
}
