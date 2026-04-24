import { injectable, inject } from 'tsyringe';
import { Consumer } from 'kafkajs';
import { KafkaClient } from '../../../infra/config/kafka-client';
import { EventoRepository } from '../../../infra/db/repositores/evento.repository';

interface EventoPayload {
  login: string;
  evento: string;
  timestamp: string;
}

@injectable()
export class ConsumerService {
  private consumer: Consumer;

  constructor(
    @inject(KafkaClient) private kafkaClient: KafkaClient,
    @inject(EventoRepository) private eventoRepo: EventoRepository
  ) {
    // O groupId é vital: define quem está lendo. 
    // Se você rodar 2 apps com mesmo groupId, o Kafka divide a carga entre eles.
    this.consumer = this.kafkaClient.kafka.consumer({ groupId: 'grupo-processador-eventos' });
  }

  async start(): Promise<void> {
    await this.consumer.connect();
    console.log('🎧 Consumer conectado e aguardando mensagens...');

    // Se inscreve no tópico
    await this.consumer.subscribe({ topic: 'evento', fromBeginning: false });

    // Começa a processar
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        
        if (!message.value) return;

        try {
          // 1. Parse da mensagem
          const payloadStr = message.value.toString();
          const dados: EventoPayload = JSON.parse(payloadStr);

          console.log(`- Mensagem recebida: ${payloadStr}`);

          // 2. Chama o Repository para salvar
          await this.eventoRepo.salvar(dados.login, dados.evento, dados.timestamp);

        } catch (e) {
          console.error(`❌ Erro processando mensagem ${prefix}:`, e);
          // Aqui você poderia enviar para um tópico de "Dead Letter Queue" (DLQ)
        }
      },
    });
  }
}