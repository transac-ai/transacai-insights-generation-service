import {
  defineChatEndpoint,
  getChatEndpointRunner,
} from "@oconva/qvikchat/endpoints";
import { setupGenkit } from "@oconva/qvikchat/genkit";

/**
 * Test suite for Open-ended chat endpoint.
 *
 * Some tests will use an LLM model. Ensure that the environment variables are set properly.
 */
describe("Test - Open-ended Chat Tests", () => {
  // Initialize endpoint runner
  const runEndpoint = getChatEndpointRunner();

  // Setup Genkit
  beforeAll(() => {
    setupGenkit();
  });

  // Tests to be performed
  // Set to true to run the test
  const Tests = {
    define_chat_flow: true,
    confirm_response_generation: true,
  };

  // default test timeout
  const defaultTimeout = 10000; // 10 secondss

  if (Tests.define_chat_flow)
    test("Define chat flow", () => {
      const flow = defineChatEndpoint({ endpoint: "test-chat" });
      expect(flow).toBeDefined();
    });

  if (Tests.confirm_response_generation)
    test(
      "Confirm response generation",
      async () => {
        const flow = defineChatEndpoint({
          endpoint: "test-chat-open-response",
        });
        const response = await runEndpoint(flow, {
          query: "How can you help? In one sentence.",
        });
        expect(response).toBeDefined();
        if (typeof response === "string") {
          // should not be empty
          expect(response.length).toBeGreaterThan(0);
        } else {
          expect(response).toHaveProperty("response");
          if ("response" in response) {
            // should not be empty
            expect(response.response.length).toBeGreaterThan(0);
          } else {
            throw new Error(
              `error in response generation. Response: ${JSON.stringify(response)}`
            );
          }
        }
      },
      defaultTimeout
    );
});
