import { getChatEndpointRunner } from "@oconva/qvikchat";
import { runFlow } from "@genkit-ai/flow";
import logger from "../utils/logger";

// Singleton instance to hold the endpoint runner
let runEndpoint: typeof runFlow | undefined;

// Method to get the endpoint runner
export function getEndpointRunner(): typeof runFlow {
  // setup logger
  const cLog = logger.child({ context: "getEndpointRunner" });
  if (!runEndpoint) {
    cLog.info(`Initializing endpoint runner instance.`);
    runEndpoint = getChatEndpointRunner();
  }
  return runEndpoint;
}
