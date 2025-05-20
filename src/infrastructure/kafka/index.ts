// kafka-wrapper.ts
import { Kafka, Producer, Consumer } from 'kafkajs';

export class KafkaWrapper {
  private _kafka?: Kafka;
  private _producer?: Producer;
  private _consumers: Consumer[] = [];

  public get kafka(): Kafka {
    if (!this._kafka) {
      throw new Error('Cannot access Kafka before connecting');
    }
    return this._kafka;
  }

  public get producer(): Producer {
    if (!this._producer) {
      throw new Error('Cannot access producer before connecting');
    }
    return this._producer;
  }

  public async connect(clientId: string, brokers: string[]): Promise<void> {
    this._kafka = new Kafka({
      clientId,
      brokers,
      retry: {
        initialRetryTime: 100, // 100ms initial delay
        retries: 5, // Maximum 5 retries
        factor: 2, // Exponential factor (100ms, 200ms, 400ms...)
        maxRetryTime: 30000, // Cap at 30 seconds
      },
    });

    this._producer = this._kafka.producer({
      allowAutoTopicCreation: false,
      idempotent: true, // Ensures exactly-once delivery semantics
      transactionalId: `${clientId}-producer`, // Enable transactions for exactly-once semantics

      // Idempotency for exactly-once semantics
      transactionTimeout: 30000,
    });

    try {
      await this._producer.connect();
      console.log('Connected to Kafka producer');
    } catch (err) {
      console.error('Failed to connect to Kafka', err);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      // Disconnect all consumers first
      await Promise.all(this._consumers.map((consumer) => consumer.disconnect()));

      // Then disconnect the producer
      if (this._producer) {
        await this._producer.disconnect();
      }
      console.log('Disconnected from Kafka');
    } catch (err) {
      console.error('Error disconnecting from Kafka', err);
      throw err;
    }
  }

  public createConsumer(groupId: string): Consumer {
    if (!this._kafka) {
      throw new Error('Cannot create consumer before connecting to Kafka');
    }

    const consumer = this._kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      retry: {
        initialRetryTime: 100, // 100ms initial delay
        retries: 5, // Maximum 10 retries
        factor: 2, // Exponential factor (100ms, 200ms, 400ms...)
        maxRetryTime: 30000, // Cap at 30 seconds
      },
    });

    this._consumers.push(consumer);
    return consumer;
  }
}

export const kafkaWrapper = new KafkaWrapper();
