# 🌐 Express Framework Module

A camada de framework é o ponto de entrada (entry-point) da aplicação via protocolo HTTP.

---

### Contexto
Responsável por expor as funcionalidades do sistema para o mundo externo, tratando requisições, realizando o parsing de corpos JSON e delegando a execução para a camada de `data`.

### Especificações Técnicas
- **Express v5:** Utiliza a versão mais recente do Express para suporte nativo a Promises em rotas.
- **Middleware de CORS:** Habilitado para integração com frontends modernos.
- **Roteamento Modular:** As rotas são divididas por domínio dentro da pasta `routes/`.

### Exemplo de Chamada (API)
```bash
# Exemplo de envio de evento para o centralizador
curl -X POST http://localhost:3000/api/v1/events \
     -H "Content-Type: application/json" \
     -d '{"type": "USER_CREATED", "payload": {"id": 1, "name": "Guilherme"}}'
```

### Diretrizes
- Nenhuma lógica de banco de dados deve estar no Controller.
- O Controller deve apenas validar o input básico e chamar o UseCase apropriado.
