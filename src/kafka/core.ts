import { Consumer, EachMessageHandler, Kafka, Producer } from "kafkajs";
import { CLIENT_ID } from "./constants";
import "dotenv/config";
import logger from "../utils/logger";

// Singleton instances
let kafka: Kafka;
let producer: Producer;
let consumer: Consumer;
let producerConnected = false;
let consumerConnected = false;

function getKafkaClient() {
  // setup logger
  const cLog = logger.child({ context: "getKafkaClient" });
  if (!kafka) {
    cLog.info(`Creating Kafka client.`);
    if (!process.env.BOOTSTRAP_SERVER) {
      throw new Error("BOOTSTRAP_SERVER is required");
    }
    if (!process.env.SASL_USERNAME) {
      throw new Error("SASL_USERNAME is required");
    }
    if (!process.env.SASL_PASSWORD) {
      throw new Error("SASL_PASSWORD is required");
    }
    if (!process.env.SASL_MECHANISMS) {
      throw new Error("SASL_MECHANISMS is required");
    }
    kafka = new Kafka({
      clientId: CLIENT_ID,
      brokers: [process.env.BOOTSTRAP_SERVER],
      ssl: true,
      sasl: {
        mechanism: "plain",
        username: process.env.SASL_USERNAME,
        password: process.env.SASL_PASSWORD,
      },
    });
  }
  return kafka;
}

export const produce = async ({
  topic,
  key,
  value,
}: {
  topic: string;
  key: string | Buffer | null | undefined;
  value: string | Buffer;
}) => {
  // setup logger
  const cLog = logger.child({ context: "produce" });

  if (!kafka) {
    cLog.info(`Kafka client not setup. Creating Kafka client.`);
    kafka = getKafkaClient();
  }

  if (!producer) {
    cLog.info("Kafka producer not setup. Creating Kafka producer.");
    producer = kafka.producer();
  }

  if (!producerConnected) {
    cLog.info("Kafka producer not connected. Connecting Kafka producer.");
    // connect producer
    await producer.connect();
    producerConnected = true;
  }

  cLog.info(`Sending message to topic ${topic}.`);
  producer.send({
    topic: topic,
    messages: [{ key, value }],
  });
};

export async function consume({
  topic,
  groupId,
  eachMessage,
}: {
  topic: string;
  groupId: string;
  eachMessage: EachMessageHandler | undefined;
}) {
  // setup logger
  const cLog = logger.child({ context: "consume" });

  if (!kafka) {
    cLog.info(`Kafka client not setup. Creating Kafka client.`);
    kafka = getKafkaClient();
  }

  if (!consumer) {
    cLog.info("Kafka consumer not setup. Creating Kafka consumer.");
    consumer = kafka.consumer({ groupId });
  }

  if (!consumerConnected) {
    cLog.info("Kafka consumer not connected. Connecting Kafka consumer.");
    // connect consumer
    await consumer.connect();
    consumerConnected = true;
  }

  cLog.info(`Subscribing to topic ${topic}.`);
  await consumer.subscribe({ topic, fromBeginning: true });

  cLog.info(`Consuming messages from topic ${topic}.`);
  consumer.run({
    eachMessage,
  });
}
