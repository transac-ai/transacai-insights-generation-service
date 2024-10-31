import { informClients } from "../../kafka/inform-client";

// Sends a test message to the `new_insights` Kafka topic
informClients({
  request_id: "test_request",
  client_id: "test_client",
  insights_id: "test_insights",
});
