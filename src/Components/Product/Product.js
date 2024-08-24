import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";
import classes from "./Product.module.css";

function Product() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		axios
			.get("https://fakestoreapi.com/products")
			.then((res) => {
				setProducts(res.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setIsLoading(false);
			});
	}, []);
console.log(products)
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<section className={classes.products_container}>
					{products?.map((singleProduct) => (
						<ProductCard
							renderAdd={true}
							key={singleProduct.id}
							product={singleProduct}
						/>
					))}
				</section>
			)}
		</>
	);
}

export default Product;
