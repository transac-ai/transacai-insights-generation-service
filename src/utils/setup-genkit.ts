import { setupGenkit as runSetupGenkit } from "@oconva/qvikchat";
import logger from "./logger";

// Store the setup status of GenKit
let genkitSetup: boolean = false;

// Method to setup GenKit
export function setupGenkit(): void {
  // setup logger
  const cLog = logger.child({ context: "setupGenkit" });
  // Check if GenKit is already setup
  if (!genkitSetup) {
    cLog.info(`Setting up GenKit.`);
    // setup genkit
    runSetupGenkit();
    // Set the GenKit setup status to true
    genkitSetup = true;
    cLog.info(`GenKit setup complete.`);
  }
}
