import { Producer } from 'kafkajs';
import { injectable, inject } from 'tsyringe';
import { KafkaClient } from '../../../infra/config/kafka-client';


interface EventoPayload {
  login: string;
  evento: string;
  timestamp: string;
}

@injectable()
export class ProducerService {
  private producer: Producer;
  private isConnected: boolean = false;

  // A mágica acontece aqui: O KafkaClient é injetado automaticamente
  constructor(@inject(KafkaClient) private kafkaClient: KafkaClient) {
    this.producer = this.kafkaClient.kafka.producer();
  }

  private async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('🔌 Producer conectado (via DI)');
    }
  }

  public async registrarEvento(login: string, nomeEvento: string): Promise<void> {
    await this.connect();

    const payload: EventoPayload = {
      login,
      evento: nomeEvento,
      timestamp: new Date().toISOString(),
    };

    try {
      await this.producer.send({
        topic: 'evento',
        messages: [{ value: JSON.stringify(payload) }],
      });
      
      console.log(`✅ [Enviado]: ${nomeEvento} | User: ${login}`);
    } catch (error) {
      console.error('❌ Erro ao enviar:', error);
    }
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}