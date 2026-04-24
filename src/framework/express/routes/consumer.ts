import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Consumer } from 'kafkajs';
import { KafkaClient } from '../../../infra/config/kafka-client';
import { EventoService } from '../../../data/service/evento/evento.service';

@injectable()
export class KafkaConsumer {
  public consumer: Consumer;

  constructor(
    @inject(KafkaClient) private kafkaClient: KafkaClient,
    @inject(EventoService) private eventoService: EventoService // <--- Injeção do Service
  ) {
    this.consumer = this.kafkaClient.kafka.consumer({ groupId: 'grupo-processador-eventos' });
  }

  async start(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'evento', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          // 1. Responsabilidade do Consumer: Deserializar
          const payload = JSON.parse(message.value.toString());

          // 2. Responsabilidade do Consumer: Delegar para a camada de negócio
          await this.eventoService.processarEvento(payload);

        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
          // Aqui você decide se envia para uma Dead Letter Queue (DLQ)
        }
      },
    });
  }
}