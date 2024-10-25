import { getChatEndpointRunner } from "@oconva/qvikchat";
import { runFlow } from "@genkit-ai/flow";

// Singleton instance to hold the endpoint runner
let runEndpoint: typeof runFlow | undefined;

// Method to get the endpoint runner
export function getEndpointRunner(): typeof runFlow {
  if (!runEndpoint) {
    runEndpoint = getChatEndpointRunner();
  }
  return runEndpoint;
}
