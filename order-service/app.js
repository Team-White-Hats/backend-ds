const express = require("express");
const dotenv = require("dotenv");
const logger = require("pino")();
const mongoose = require("mongoose");
const cors = require("cors");
const expressSession = require("express-session");
const amqp = require("amqplib");
const Order = require("./src/model/orderModel");

var channel, connect;

const app = express();
dotenv.config();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());
app.set("trust proxy", 1);
const sessSettings = expressSession({
	path: "/",
	secret: "oursecret",
	resave: true,
	saveUninitialized: true,
	cookie: {
		sameSite: false,
		secure: false,
		maxAge: 360000,
	},
});


app.use(sessSettings);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
	logger.info(" Mongodb connected successfully");
});

app.get("/", (req, res) => {
	res.status(200).json({ messsage: "Server is running!" });
});

// RabbitMQ connection
async function connectToRabbitMQ() {
	const amqpServer = "amqp://guest:guest@localhost:5672";
	connect = await amqp.connect(amqpServer);
	channel = await connect.createChannel();
	await channel.assertQueue("order-service-queue");
  }
  
  // Create an order
  createOrder = (products) => {
	let total = 0;
	products.forEach((product) => {
	  total += product.price;
	});
  
	const order = new Order({
	  products,
	  total,
	});
	order.save();
	return order;
  };
  
  connectToRabbitMQ().then(() => {
	channel.consume("order-service-queue", (data) => {
	  // order service queue listens to this queue
	  const { products } = JSON.parse(data.content);
	  const newOrder = createOrder(products);
	  channel.ack(data);
	  channel.sendToQueue(
		"product-service-queue",
		Buffer.from(JSON.stringify(newOrder))
	  );
	});
  });
  
app.listen(PORT, () => {
	logger.info(`Server is running on PORT: ${PORT}`);
});