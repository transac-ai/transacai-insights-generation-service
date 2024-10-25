import { setupGenkit, runServer } from "@oconva/qvikchat/genkit";
import { definePublicEndpoints } from "./core/public-endpoints";

// Setup Genkit
setupGenkit();

// Method to define all endpoints of the project and run the server
const defineEndpointsRunServer = async () => {
  // define all endpoints
  await definePublicEndpoints();

  // Run server
  runServer();
};

// execute method to define endpoints and run server
defineEndpointsRunServer();
