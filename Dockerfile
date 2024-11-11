# Etapa 1: Construcción de la aplicación
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (o yarn.lock) para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Transpilar TypeScript a JavaScript
RUN npm run build

# Verificar si el archivo dist/main.js se genera correctamente
RUN ls -la dist

# Etapa 2: Preparar la imagen final
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar dependencias y el código transpilado desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8080

# Comando de inicio de la aplicación
CMD ["node", "dist/src/main"]