import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";

const ProtectedRoute = ({ children }) => {
	const navigate = useNavigate();
	const [{ user }] = useContext(DataContext);

	useEffect(() => {
		if (!user) {
			navigate("/auth", {
				state: { msg: "You need to log in to access this page." },
			});
		}
	}, [user, navigate]);


	return user ? children : null;
};

export default ProtectedRoute;
