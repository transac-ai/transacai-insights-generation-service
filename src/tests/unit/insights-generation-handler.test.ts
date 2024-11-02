import { insightsGenerationHandler } from "../../core/igs-handler";
import { BuildPromptRequest } from "../../transac-ai-services/pbs/types";

// Mock the dependencies
const buildPrompt = jest.createMockFromModule(
  "../../transac-ai-services/pbs/service"
);
const generateInsights = jest.createMockFromModule(
  "../../endpoints/insights-gen-endpoint"
);
const saveInsights = jest.createMockFromModule("../../db/insights-db");
const informClients = jest.createMockFromModule(
  "../../kafka-handlers/inform-client"
);

describe("insightsGenerationHandler", () => {
  const params: BuildPromptRequest = {
    req_id: "1",
    client_id: "test_client",
    prompt_id: 1,
    records_source_id: "supabase",
    prompt_templates_source_id: "supabase",
    from_time: "2019-12-29T06:39:22",
    to_time: "2019-12-29T23:49:22",
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  it.skip("should handle successful execution", async () => {
    const prompt = "test prompt";
    const insights = "test insights";
    const insightsId = "insights123";

    await insightsGenerationHandler(params);

    expect(buildPrompt).toHaveBeenCalledWith(params);
    expect(generateInsights).toHaveBeenCalledWith(prompt);
    expect(saveInsights).toHaveBeenCalledWith({
      requestId: params.req_id,
      clientId: params.client_id,
      insights,
      fromTime: params.from_time,
      toTime: params.to_time,
    });
    expect(informClients).toHaveBeenCalledWith({
      reqId: params.req_id,
      clientId: params.client_id,
      insightsId,
    });
  }, 5000);

  it.skip("should throw an error if prompt is empty", async () => {
    (buildPrompt as jest.Mock).mockResolvedValue({ prompt: "" });

    await expect(insightsGenerationHandler(params)).rejects.toThrow(
      "Error generating prompt. Received empty prompt from PBS."
    );
  });
});
