import React, { useContext } from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import { SlLocationPin } from "react-icons/sl";
import { BsSearch } from "react-icons/bs";
import LowerHeader from "./LowerHeader";
import { BiCart } from "react-icons/bi";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";

function Header() {
	const [{ user, basket }, dispatch] = useContext(DataContext);
	const totalItem = basket?.reduce((amount, item) => {
		return item.amount + amount;
	}, 0);

	// console.log(basket.length);

	return (
		<section className={classes.fixed}>
			<section>
				<div className={classes.header_container}>
					{/* Logo section */}
					<div className={classes.logo_container}>
						<Link to="/">
							<img
								src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
								alt="amazon-logo"
							/>
						</Link>
						<div className={classes.delivery}>
							<span>
								<SlLocationPin />
							</span>
							<div>
								<p>Delivery to</p>
								<span>Ethiopia</span>
							</div>
						</div>
					</div>
					{/* Search section */}
					<div className={classes.search}>
						<select>
							<option value="">All</option>
						</select>
						<input type="text" placeholder="Search..." />
						<BsSearch size={38} />
					</div>
					{/* Other section */}
					<div className={classes.order_container}>
						<Link to="#" className={classes.language}>
							<img
								src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1024px-Flag_of_the_united_States.svg.png"
								alt="US Flag"
							/>
							<select>
								<option value="">EN</option>
							</select>
						</Link>
						<Link to={!user && "/auth"}>
							<div>
								{user ? (
									<>
										<p>Hello {user?.email?.split("@")[0]}</p>
										<span onClick={() => auth.signOut()}>Sign Out</span>
									</>
								) : (
									<>
										<p> Hello , Sign In </p>
										<span>Account & Lists</span>
									</>
								)}
							</div>
						</Link>
						<Link to="/Orders">
							<p>Returns</p>
							<span>& Orders</span>
						</Link>
						<Link to="/Cart" className={classes.cart}>
							<BiCart size={35} />
							<span>{totalItem}</span>
						</Link>
					</div>
				</div>
			</section>
			<LowerHeader />
		</section>
	);
}

export default Header;
