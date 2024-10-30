import "dotenv/config";

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
  clientId: string;
  requestId: string;
  fromTime: string;
  toTime: string;
  insights: string;
};

/**
 * Type definition for response of createInsight mutation.
 *
 * @property {string} data.createInsight - ID of the saved insights
 */
export type CreateInsightResponse = {
  data: {
    createInsight: string;
  };
};

/**
 * Method to save insights to the database.
 * @param params - Data required to save insights to database
 * @returns ID of the saved insights
 */
export async function saveInsights(params: SaveInsightsParams) {
  // get the ISS service address and API key from environment variables
  const ISS_SERVICE_ADDRESS = process.env.ISS_SERVICE_ADDRESS;
  const ISS_API_KEY = process.env.ISS_API_KEY;
  // check if the ISS service address and API key are set
  if (!ISS_SERVICE_ADDRESS || !ISS_API_KEY) {
    throw new Error(
      "Server address or API key is not set in environment variables"
    );
  }
  // prepare the query
  const query = `
    mutation cr($data: InsightCreateInput!) {
      createInsight(data: $data) 
    }
  `;
  // prepare the data to be sent in the request
  const variables = {
    data: {
      ...params,
    },
  };

  // call the ISS service to save the insights
  const response = await fetch(ISS_SERVICE_ADDRESS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${ISS_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  // parse the response
  const result = (await response.json()) as CreateInsightResponse & {
    errors?: { message: string }[];
  };

  console.log(JSON.stringify(result));

  // check if the response is successful
  if (response.ok) {
    // return the ID of the saved insights
    return result.data.createInsight;
  } else {
    throw new Error(result.errors ? result.errors[0].message : "Unknown error");
  }
}
