import { injectable, inject } from 'tsyringe';
import { EventoRepository } from '../../../infra/db/repositores/evento.repository';

interface EventoDTO {
  login: string;
  evento: string;
  timestamp: string;
}

@injectable()
export class EventoService {
  constructor(
    @inject(EventoRepository) private eventoRepo: EventoRepository
  ) {}

  async processarEvento(dados: EventoDTO): Promise<void> {
    console.log(`🔄 Processando regra de negócio para: ${dados.evento}`);

    // Exemplo de regra de negócio que ficaria aqui:
    if (!dados.login) {
      throw new Error('Evento sem login não pode ser processado');
    }

    // Se tudo estiver ok, chama o repositório
    await this.eventoRepo.salvar(dados.login, dados.evento, dados.timestamp);
  }
}