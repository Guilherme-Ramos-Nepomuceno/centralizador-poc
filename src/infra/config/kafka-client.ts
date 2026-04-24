import { Kafka } from 'kafkajs';
import { singleton } from 'tsyringe';

@singleton()
export class KafkaClient {
  public readonly kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'centralizador',
      brokers: [process.env.KAFKA_BROKERS!],
      retry: {
        initialRetryTime: 300,
        retries: 10
      }
    });
  }
}