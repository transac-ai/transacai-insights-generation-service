import { KafkaInsightsUpdateDataSchema } from "../types/types";

export function dispatchMsg(topic: string, msg: string) {
  console.log(`Dispatching message to ${topic}: ${msg}`);
}

export function informClients(data: KafkaInsightsUpdateDataSchema) {
  dispatchMsg("clients", data.clientId);
}
