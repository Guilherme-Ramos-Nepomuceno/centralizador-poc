import { Pool } from 'pg';
import { singleton } from 'tsyringe';

@singleton()
export class Database {
  public readonly pool: Pool;

  constructor() {
   const connectionString = process.env.DATABASE_URL; 

    this.pool = new Pool({ connectionString });

    this.pool.on('connect', () => {
      console.log('📦 Pool de conexão com Banco criado');
    });
    
    this.pool.on('error', (err) => {
      console.error('❌ Erro inesperado no client do banco', err);
    });
  }
}