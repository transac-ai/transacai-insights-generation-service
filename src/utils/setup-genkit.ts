import { setupGenkit as runSetupGenkit } from "@oconva/qvikchat";

// Store the setup status of GenKit
let genkitSetup: boolean = false;

// Method to setup GenKit
export function setupGenkit(): void {
  if (!genkitSetup) {
    // setup genkit
    runSetupGenkit();
    // Set the GenKit setup status to true
    genkitSetup = true;
  }
}
