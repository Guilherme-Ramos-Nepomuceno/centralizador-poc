import 'reflect-metadata'; // OBRIGATÓRIO NA PRIMEIRA LINHA
import { container } from 'tsyringe';
import { ProducerService } from '../../../data/service/evento/producer.service';


const usuarios = ['joao.ts', 'maria.node', 'admin.sys'];
const eventos = ['LOGIN', 'CLICK', 'VIEW'];

function gerarDados() {
  return {
    user: usuarios[Math.floor(Math.random() * usuarios.length)],
    evt: eventos[Math.floor(Math.random() * eventos.length)]
  };
}

async function main() {
  // Aqui pedimos para o container nos dar a instância do serviço com tudo injetado
  const producerService = container.resolve(ProducerService);

  console.log('🚀 Iniciando worker TypeScript...');

  // Loop de 5 segundos
  setInterval(async () => {
    const { user, evt } = gerarDados();
    await producerService.registrarEvento(user, evt);
  }, 5000);

  // Graceful Shutdown
  process.on('SIGINT', async () => {
    await producerService.disconnect();
    process.exit(0);
  });
}

main();