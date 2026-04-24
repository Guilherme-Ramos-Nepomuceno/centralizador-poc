import { injectable, inject } from 'tsyringe';
import { Database } from '../database';

@injectable()
export class EventoRepository {
  constructor(@inject(Database) private db: Database) {}

  async salvar(login: string, evento: string, timestamp: string): Promise<void> {
    const query = `
      INSERT INTO log_eventos (login, nome_evento, data_ocorrencia)
      VALUES ($1, $2, $3)
    `;

    const values = [login, evento, timestamp];

    try {
      await this.db.pool.query(query, values);
      console.log(`💾 Salvo no banco: ${evento} de ${login}`);
    } catch (error) {
      console.error('❌ Erro ao inserir no banco:', error);
      throw error; // Relança para o Consumer saber que falhou
    }
  }
}