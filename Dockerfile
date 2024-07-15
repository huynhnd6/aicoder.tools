FROM node:latest

RUN apt-get update && apt-get install -y rpm

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
