const express = require("express");
const dotenv = require("dotenv");
const logger = require("pino")();
const cors = require("cors");
const expressSession = require("express-session");
const proxy=require("express-http-proxy")

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

app.use("/user",proxy('http://localhost:3002'))
app.use("/product",proxy('http://localhost:3003'))
app.use("/payment",proxy('http://localhost:3004'))
app.use("/message",proxy('http://localhost:3005'))
app.use("/order",proxy('http://localhost:3006'))
app.use("/delivery",proxy('http://localhost:3007'))

app.get("/", (req, res) => {
	res.status(200).json({ messsage: "Gate way Server is running!" });
});


app.listen(PORT, () => {
	logger.info(`Gate Way Server is running on PORT: ${PORT}`);
});