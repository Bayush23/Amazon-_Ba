
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);


const app = express();
// const stripeApiKey = process.env.STRIPE_KEY;

app.use(cors({ origin: true }));
app.use(express.json());

// const stripeClient = stripe(stripeApiKey);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Success",
	});
});

app.post("/payment/create", async (req, res) => {
	const total = parseInt(req.query.total);

	try {
		if (total > 0) {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: total * 100,
				currency: "usd",
			});

			logger.info("Payment received:", total);
			console.log(paymentIntent);
			res.status(201).json({
				clientSecret: paymentIntent.client_secret,
			});
		} else {
			res.status(400).json({
				error: "Invalid amount",
			});
		}
	} catch (error) {
		logger.error("Error processing payment:", error.message);
		res.status(500).json({
			error: "Failed to create payment intent",
		});
	}
});

exports.api = onRequest(app);
