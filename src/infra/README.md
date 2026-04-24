# 🛠️ Infrastructure Module

Este módulo é responsável por todas as integrações com serviços externos e bibliotecas de baixo nível que suportam a aplicação.

---

### Contexto
Para garantir que a lógica de negócio (`data`) permaneça pura, todas as implementações reais de clientes de banco de dados e mensageria residem aqui.

### Especificações Técnicas
- **Database (PostgreSQL):** Utiliza o driver `pg` puro para máxima performance e controle sobre as queries.
- **Kafka Client:** Implementado com `kafkajs`, configurado para suportar tanto operações de Producer quanto de Consumer.
- **Dependency Injection:** Utiliza o `tsyringe` para registrar os singletons dos clientes, permitindo que sejam injetados em qualquer Use Case ou Service.

### Regras de Negócio
- Conexões com o banco devem ser validadas no startup.
- O Producer Kafka deve garantir a entrega das mensagens (acks: all) em fluxos críticos.

### Exemplo de Configuração
```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'centralizador-poc',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092']
});
```
