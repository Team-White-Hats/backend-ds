const paymentData = require("../model/PaymentModel");
const amqp = require("amqplib");
let order,channel,connection;


// Connect to RabbitMQ
async function connectToRabbitMQ() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("payment-service-queue");
}
connectToRabbitMQ();
const createPayment = async (req, res)  => {
	try {
		paymentData.create(req.body, (err, data) => {
			if (err) res.status(500).json({ error: err });
			res.status(201).json(data);
		  });

		  const payment = {
			amount: req.body.amount,
			phoneNumber: req.body.phoneNumber,
			oderid:req.body.oderid,
		  };

	  console.log('Payment created:',payment);
	  const rabbitmqUrl = 'amqp://guest:guest@localhost:5672';
	  // Connect to RabbitMQ
	  const connection = await amqp.connect(rabbitmqUrl);
	  const channel = await connection.createChannel();
  
	  // Assert the queue
	  await channel.assertQueue('sms-service-queue', { durable: true });
  
	  // Publish payment information to sms-service-queue
	  await channel.sendToQueue('sms-service-queue', Buffer.from(JSON.stringify(payment)), { persistent: true });
  
	  console.log('Payment information sent to SMS microservice:', payment);
  
	  // Close RabbitMQ connection
	  await channel.close();
	  await connection.close();
	} catch (error) {
	  console.error('Failed to create payment:', error);
	}
  };


module.exports = {
	createPayment
  };