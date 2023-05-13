const express = require("express");
const dotenv = require("dotenv");
const logger = require("pino")();
const mongoose = require("mongoose");
const cors = require("cors");
const expressSession = require("express-session");
const amqp = require("amqplib");
const app = express();
dotenv.config();
const {Vonage} = require('@vonage/server-sdk');
const{
	VONAGE_API_KEY,
	VONAGE_API_SECRET
	}=process.env

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

app.get("/", (req, res) => {
	res.status(200).json({ messsage: "Server is running!" });
});
//rabitMQ connection
// RabbitMQ connection
//async function connectToRabbitMQ() {
//	const amqpServer = "amqp://guest:guest@localhost:5672";
//	connect = await amqp.connect(amqpServer);
	//channel = await connect.createChannel();
	//await channel.assertQueue("sms-service-queue");
  //}


//sms service


const vonage = new Vonage({
	apiKey:VONAGE_API_KEY,
	apiSecret: VONAGE_API_SECRET
  });
 

// Set up RabbitMQ connection details
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672'; // Replace with your actual RabbitMQ connection URL

// Define the createSMS function to send SMS with payment information
const createSMS = async (paymentData) => {
	try {
	  const from = 'Vonage APIs';
	  const to = paymentData.phoneNumber;
	  const text = `Your purchase Amount: ${paymentData.amount}`;
  
	  await vonage.sms.send({ to, from, text });
	  console.log('SMS sent successfully:', paymentData);
	} catch (error) {
	  console.error('Failed to send SMS:', error);
	}
  };
  
  // Define the connectToRabbitMQ function to connect to RabbitMQ and consume messages
  const connectToRabbitMQ = async () => {
	try {
	  // Connect to RabbitMQ
	  const connection = await amqp.connect(rabbitmqUrl);
	  const channel = await connection.createChannel();
  
	  // Assert the queue
	  await channel.assertQueue('sms-service-queue', { durable: true });
  
	  // Consume messages from sms-service-queue
	  await channel.consume('sms-service-queue', (data) => {
		const paymentInfo = JSON.parse(data.content.toString());
		console.log('Payment information received:', paymentInfo);
		// Call createSMS function with payment information to send SMS
		createSMS(paymentInfo);
		channel.ack(data); // Acknowledge the message as received
	  });
  
	  console.log('Connected to RabbitMQ and consuming messages from sms-service-queue');
	} catch (error) {
	  console.error('Failed to connect to RabbitMQ:', error);
	}
  };
  
connectToRabbitMQ();

app.listen(PORT, () => {
	logger.info(`Server is running on PORT: ${PORT}`);
});

