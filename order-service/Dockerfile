FROM node

WORKDIR /app/order

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm run dev", "start"]