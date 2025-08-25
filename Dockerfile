FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN touch .env && cp .env.dev .env
RUN rm .env.dev
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
