import { Consumer, EachMessageHandler, Kafka, Producer } from "kafkajs";
import { CLIENT_ID } from "./constants";
import "dotenv/config";

// Singleton instances
let kafka: Kafka;
let producer: Producer;
let consumer: Consumer;
let producerConnected = false;
let consumerConnected = false;

function getKafkaClient() {
  if (!kafka) {
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
  if (!kafka) {
    kafka = getKafkaClient();
  }

  if (!producer) {
    producer = kafka.producer();
  }

  if (!producerConnected) {
    // connect producer
    await producer.connect();
    producerConnected = true;
  }

  await producer.send({
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
  if (!kafka) {
    kafka = getKafkaClient();
  }

  if (!consumer) {
    consumer = kafka.consumer({ groupId });
  }

  if (!consumerConnected) {
    // connect consumer
    await consumer.connect();
    consumerConnected = true;
  }

  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage,
  });
}
