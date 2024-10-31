import logger from "../utils/logger";
import { TOPICS } from "./constants";
import { produce } from "./core";
import { KafkaNewInsightsDataSchema } from "./types";

/**
 * Inform clients about new insights generated for a request.
 *
 * @param {KafkaInsightsUpdateDataSchema} data The data containing the request ID, client ID, and insights ID.
 */
export function informClients(data: KafkaNewInsightsDataSchema) {
  // setup logger
  const cLog = logger.child({
    context: "informClients",
    requestId: data.request_id,
  });
  cLog.info(`Informing clients about new insights.`);
  // Convert message and key to buffer
  const value = Buffer.from(JSON.stringify(data));
  const key = Buffer.from(data.request_id);
  // Send message to the Kafka topic
  produce({ topic: TOPICS.NEW_INSIGHTS, key, value })
    .then(() => {
      cLog.info(`Message sent to topic ${TOPICS.NEW_INSIGHTS}`);
    })
    .catch((error) => {
      cLog.error(
        `Error sending message to topic ${TOPICS.NEW_INSIGHTS}: ${error}`
      );
    });
}
