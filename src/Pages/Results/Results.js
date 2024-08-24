import React, { useEffect, useState } from "react";
import classes from "./Results.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import Loader from "../../Components/Loader/Loader";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints";
import ProductCard from "../../Components/Product/ProductCard";

function Results() {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { categoryName } = useParams();
	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`${productUrl}/products/category/${categoryName}`)
			.then((res) => {
				setResults(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<LayOut>
			<section>
				<h1 style={{ padding: "30px" }}>Results</h1>
				<p style={{ padding: "30px" }}>Category / {categoryName}</p>
				<hr />
				{/* {isLoading ? ( */}
				{/* <Loader /> */}
				{/* ) : ( */}
				<div className={classes.products_container}>
					{results?.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							renderDesc={false}
							renderAdd={true}
						/>
					))}
				</div>
				{/* )} */}
			</section>
		</LayOut>
	);
}

export default Results;
