# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./
COPY tsconfig.json ./

# Instala todas as dependências (incluindo devDependencies para compilar)
RUN npm ci

# Copia o código fonte
COPY src ./src

# Compila o TypeScript (gera a pasta dist)
RUN npm run build

# --------------------------------------------------

# Estágio 2: Produção
FROM node:22-alpine

WORKDIR /app

# Copia apenas o package.json para instalar deps de produção
COPY package*.json ./

# Instala APENAS dependencies (sem typescript, @types, etc) para ficar leve
RUN npm ci --only=production

# Copia o código compilado do estágio anterior
COPY --from=builder /app/dist ./dist

# Define usuário node (segurança)
USER node

# O comando padrão será sobrescrito no docker-compose
CMD ["npm", "run", "start:api"]