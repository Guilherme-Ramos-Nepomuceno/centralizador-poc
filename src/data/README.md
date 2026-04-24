# 📦 Core & Business Logic (Data)

Este é o coração da aplicação, onde reside a lógica de negócio pura e independente de frameworks.

---

### Contexto
Aqui definimos "o que" o sistema faz. Esta camada não conhece o Express, o Kafka ou o Postgres; ela conhece apenas Interfaces e Entidades de Negócio.

### Componentes Principais
- **Use Cases:** Classes que orquestram o fluxo de dados para atingir um objetivo de negócio (ex: `ProcessIncomingEvent`).
- **Repositories (Interfaces):** Definições de contrato para persistência de dados.
- **DTOs:** Objetos de transferência de dados para entrada e saída das funções core.

### Regras de Negócio
- Todo evento processado deve ser registrado no banco de dados para auditoria.
- Falhas no processamento devem ser capturadas e enviadas para uma Dead Letter Queue (DLQ) no Kafka (planejado).

### Exemplo de Uso (Pseudo-código)
```typescript
class ProcessEventUseCase {
  constructor(private eventRepo: IEventRepository) {}

  async execute(data: EventDTO): Promise<void> {
    // Validações e Persistência
    await this.eventRepo.save(data);
  }
}
```
