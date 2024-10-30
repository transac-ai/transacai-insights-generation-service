import {
  saveInsights,
  SaveInsightsParams,
} from "../../transac-ai-services/iss/save-insights";

describe("Saving New Insights through ISS", () => {
  it("should save new insights to the database", async () => {
    // prepare sample data
    const params: SaveInsightsParams = {
      clientId: "test_client",
      // generate random request ID
      requestId: Math.random().toString(36).substring(7),
      fromTime: "2019-12-29T06:39:22Z",
      toTime: "2019-12-29T23:49:22Z",
      insights: "test insights",
    };

    // save insights to the database and get the ID of the saved insights
    const insightsId = await saveInsights(params);

    // check if the insights ID is not empty
    if (insightsId) {
      // confirm id to be an integer
      try {
        const parsedId = parseInt(insightsId);
        expect(parsedId).toBeGreaterThan(0);
      } catch (e) {
        throw new Error(`Insights ID is not a number. Parsing error: ${e}`);
      }
    } else {
      throw new Error("Insights ID is empty");
    }
  });
});
