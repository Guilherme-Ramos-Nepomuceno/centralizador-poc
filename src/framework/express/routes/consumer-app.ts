import 'reflect-metadata';
import { container } from 'tsyringe';
import { KafkaConsumer } from './consumer';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando Kafka Consumer...');
    
    const consumer = container.resolve(KafkaConsumer);
    await consumer.start();
    
    console.log('✅ Consumer conectado e aguardando mensagens...');
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('⚠️  Encerrando consumer...');
      await consumer.consumer.disconnect();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar consumer:', error);
    process.exit(1);
  }
}

bootstrap();