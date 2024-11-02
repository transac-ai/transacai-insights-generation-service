// Test generateInsights function

import { generateInsights } from "../../endpoints/insights-gen-endpoint";

describe("generateInsights", () => {
  it.skip("should use LLM to process prompt and generate response", async () => {
    // test prompt
    const prompt = "Colors in a rainbow? Answer in a sentence.";
    const insights = await generateInsights(prompt);

    // validate response
    // should be defined
    expect(insights).toBeDefined();
    // should not be empty
    expect(insights).not.toEqual("");
    // should contain substring "blue"
    expect(insights).toContain("blue");
  });
});
