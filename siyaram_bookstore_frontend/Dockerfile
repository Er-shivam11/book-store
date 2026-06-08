# siyaram_bookstore_frontend/Dockerfile

FROM node:22-alpine

WORKDIR /app

# install dependencies first
COPY package.json package-lock.json ./
RUN npm ci

# copy project files
COPY . .

EXPOSE 5173

# generic command (override in docker-compose)
CMD ["npm", "run", "dev"]