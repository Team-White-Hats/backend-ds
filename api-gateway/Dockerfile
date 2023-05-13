FROM node:alpine

WORKDIR /app/api-gateway

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm", "start"]