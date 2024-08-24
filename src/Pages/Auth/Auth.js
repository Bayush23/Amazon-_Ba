import React, { useState, useContext } from "react";
import classes from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { ClipLoader } from "react-spinners";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";

function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState({
		signIn: false,
		signUp: false,
	});

	const [{ user }, dispatch] = useContext(DataContext);
	const navigate = useNavigate();
	const location = useLocation();
	const navStateData = location.state || {}; // Access state from location

	const authHandler = async (e) => {
		e.preventDefault();

		if (e.target.name === "signin") {
			setLoading({ ...loading, signIn: true });
			try {
				const userInfo = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				dispatch({
					type: Type.SET_USER,
					user: userInfo.user,
				});
				setLoading({ ...loading, signIn: false });
				navigate(navStateData.redirect || "/");
			} catch (err) {
				setError(err.message);
				setLoading({ ...loading, signIn: false });
			}
		} else {
			setLoading({ ...loading, signUp: true });
			try {
				const userInfo = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				dispatch({
					type: Type.SET_USER,
					user: userInfo.user,
				});
				setLoading({ ...loading, signUp: false });
				navigate("/");
			} catch (err) {
				setError(err.message);
				setLoading({ ...loading, signUp: false });
			}
		}
	};

	return (
		<section className={classes.login}>
			{/* logo */}
			<Link to="/">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
					alt="Amazon Logo"
				/>
			</Link>

			{/* form */}
			<div className={classes.login_container}>
				<h1>Sign In</h1>
				{navStateData.msg && (
					<small
						style={{
							padding: "5px",
							textAlign: "center",
							color: "red",
							fontWeight: "bold",
						}}
					>
						{navStateData.msg}
					</small>
				)}
				<form onSubmit={authHandler}>
					<div>
						<label htmlFor="email">Email</label>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							id="email"
						/>
					</div>

					<div>
						<label htmlFor="password">Password</label>
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							id="password"
						/>
					</div>
					<button
						type="submit"
						name="signin"
						className={classes.login_signInButton}
					>
						{loading.signIn ? <ClipLoader color="#000" size={15} /> : "Sign In"}
					</button>
				</form>
				{/* agreement */}
				<p>
					By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
					Sale. Please see our Privacy Notice, our Cookies Notice and our
					Interest-Based Ads Notice.
				</p>
				{/* create account btn */}
				<button
					type="button"
					name="signup"
					onClick={authHandler}
					className={classes.login_registerButton}
				>
					{loading.signUp ? (
						<ClipLoader color="#000" size={15} />
					) : (
						"Create your Amazon Account"
					)}
				</button>
				{error && (
					<small style={{ paddingTop: "5px", color: "red" }}>{error}</small>
				)}
			</div>
		</section>
	);
}

export default Auth;
