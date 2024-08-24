// import React, { useEffect, useState, useContext } from "react";
// import LayOut from "../../Components/LayOut/LayOut";
// import classes from "../Orders/Orders.module.css";
// import { db } from "../../Utility/firebase"; 
// import ProductCard from "../../Components/Product/ProductCard";
// import { DataContext } from "../../Components/DataProvider/DataProvider";

// function Orders() {
// 	const [{ user }, dispatch] = useContext(DataContext);
// 	const [orders, setOrders] = useState([]);
// 	const [deliveryAddress, setDeliveryAddress] = useState("");
// 	const [isEditing, setIsEditing] = useState(false);

// 	useEffect(() => {
// 		if (user) {
// 			const unsubscribe = db
// 				.collection("users")
// 				.doc(user.uid)
// 				.collection("orders")
// 				.orderBy("created", "desc")
// 				.onSnapshot((snapshot) => {
// 					setOrders(
// 						snapshot.docs.map((doc) => ({
// 							id: doc.id,
// 							data: doc.data(),
// 						}))
// 					);
// 				});

// 			return () => unsubscribe(); // Add return function to clean up the subscription
// 		} else {
// 			setOrders([]);
// 		}
// 	}, [user]);

// 	const handleAddressChange = (e) => {
// 		setDeliveryAddress(e.target.value);
// 	};

// 	const handleSaveAddress = () => {
// 		if (user) {
// 			db.collection("users")
// 				.doc(user.uid)
// 				.update({ deliveryAddress })
// 				.then(() => {
// 					alert("Delivery address updated successfully!");
// 				})
// 				.catch((error) => {
// 					console.error("Error updating address: ", error);
// 				});
// 		}
// 	};

// 	const toggleEdit = () => {
// 		setIsEditing(!isEditing);
// 	};

// 	return (
// 		<LayOut>
// 			<section className={classes.container}>
// 				<div className={classes.orders_container}>
// 					<h2>Your Orders</h2>
// 					{orders.length === 0 && (
// 						<div style={{ padding: "20px" }}>You don't have orders yet.</div>
// 					)}
// 					{/* Address Section */}
// 					<div className={classes.address_section}>
// 						<h3>Delivery Address</h3>
// 						{isEditing ? (
// 							<div>
// 								<input
// 									type="text"
// 									value={deliveryAddress}
// 									onChange={handleAddressChange}
// 									placeholder="Enter your delivery address"
// 								/>
// 								<button onClick={handleSaveAddress}>Save Address</button>
// 							</div>
// 						) : (
// 							<div>
// 								<p>{deliveryAddress || "No address set"}</p>
// 								<button onClick={toggleEdit}>Edit Address</button>
// 							</div>
// 						)}
// 					</div>
// 					{/* Order items */}
// 					<div>
// 						{orders.map((eachOrder) => (
// 							<div key={eachOrder.id}>
// 								<hr />
// 								<p>Order ID: {eachOrder.id}</p>
// 								{eachOrder.data.basket.map((order) => (
// 									<ProductCard key={order.id} flex={true} product={order} />
// 								))}
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</section>
// 		</LayOut>
// 	);
// }

// export default Orders;
import React, { useContext, useState, useEffect } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import classes from "./Orders.module.css";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";

function Orders() {
	const [{ user }] = useContext(DataContext);
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (user) {
			const unsubscribe = db
				.collection("users")
				.doc(user.uid)
				.collection("orders")
				.orderBy("created", "desc")
				.onSnapshot(
					(snapshot) => {
						setOrders(
							snapshot.docs.map((doc) => ({
								id: doc.id,
								data: doc.data(),
							}))
						);
					},
					(error) => {
						setError("Failed to fetch orders. Please try again later.");
						console.error("Firestore error: ", error);
					}
				);

			// Cleanup Firestore listener on unmount
			return () => unsubscribe();
		} else {
			setOrders([]);
		}
	}, [user]);

	return (
		<LayOut>
			<section className={classes.container}>
				<div className={classes.orders_container}>
					<h2>Your Orders</h2>
					{error && <div className={classes.error_message}>{error}</div>}
					<div>
						{orders.length === 0 ? (
							<div className={classes.no_orders_message}>
								You don't have any orders yet.
							</div>
						) : (
							orders.map((eachOrder) => (
								<div key={eachOrder.id} className={classes.order}>
									<hr />
									<p>Order ID: {eachOrder.id}</p>
									{eachOrder.data?.basket?.map((order) => (
										<ProductCard key={order.id} flex={true} product={order} />
									))}
								</div>
							))
						)}
					</div>
				</div>
			</section>
		</LayOut>
	);
}

export default Orders;
