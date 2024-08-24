import React, { useContext, useState, useCallback } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
	const [{ user, basket }, dispatch] = useContext(DataContext);
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const [cardError, setCardError] = useState(null);
	const [processing, setProcessing] = useState(false);

	const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
	const total = basket.reduce(
		(amount, item) => item.price * item.amount + amount,
		0
	);

	const handleChange = useCallback((e) => {
		setCardError(e?.error?.message || "");
	}, []);
	
	const handlePayment = useCallback(
		async (e) => {
			e.preventDefault();
			setProcessing(true);

			try {
				const response = await axiosInstance.post(
					`/payment/create?total=${total * 100}`
				);
				const clientSecret = response.data?.clientSecret;

				const { paymentIntent } = await stripe.confirmCardPayment(
					clientSecret,
					{
						payment_method: { card: elements.getElement(CardElement) },
					}
				);

				await db
					.collection("users")
					.doc(user.uid)
					.collection("orders")
					.doc(paymentIntent.id)
					.set({
						basket,
						amount: paymentIntent.amount,
						created: paymentIntent.created,
					});

				dispatch({ type: Type.EMPTY_BASKET });
				navigate("/Orders", { state: { msg: "You have placed a new order" } });
			} catch (error) {
				console.error("Payment Error: ", error);
				setCardError("Payment failed. Please try again.");
			} finally {
				setProcessing(false);
			}
		},
		[basket, dispatch, elements, navigate, stripe, total, user.uid]
	);

	return (
		<LayOut>
			<div className={classes.payment_header}>Checkout ({totalItem}) items</div>
			<section className={classes.payment}>
				<div className={classes.flex}>
					<h3>Delivery Address</h3>
					<div>
						<div>abe@gmail.com</div>
						<div>123 React Lane</div>
						<div>Chicago, IL</div>
					</div>
				</div>
				<hr />
				<div>
					<h3 className={classes.flex}>Review items and delivery</h3>
					<div>
						{basket?.map((item) => (
							<ProductCard key={item.id} product={item} flex={true} />
						))}
					</div>
				</div>
				<hr />
				<div className={classes.flex}>
					<h3>Payment Methods</h3>
					<div className={classes.payment_card_container}>
						<div className={classes.payment__details}>
							<form onSubmit={handlePayment}>
								{cardError && (
									<small className={classes.error_message}>{cardError}</small>
								)}
								<CardElement onChange={handleChange} />
								<div className={classes.payment__price}>
									<div>
										<span style={{ display: "flex", gap: "10px" }}>
											<p>Total Order |</p>
											<CurrencyFormat amount={total} />
										</span>
									</div>
									<button type="submit" disabled={processing}>
										{processing ? (
											<div className={classes.loading}>
												<ClipLoader color="gray" size={12} />
												<p>Please Wait ...</p>
											</div>
										) : (
											"Pay Now"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</LayOut>
	);
}

export default Payment;
