FROM node

WORKDIR /app/delivery

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3006

CMD ["npm", "start"]