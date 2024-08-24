import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Auth from "./Pages/Auth/Auth";
import Payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import Results from "./Pages/Results/Results";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Cart from "./Pages/Cart/Cart";
import { Elements } from "@stripe/react-stripe-js";
import{loadStripe} from"@stripe/stripe-js";
import ProtectedRoute from "./Components/ProtectetedRoute/ProtectedRoute";
const stripePromise = loadStripe(
	"pk_test_51PfVvoDk1tZ3kRLgZXfdh52yDmP0PDkCL3AE0RF3oeo4vr1wVPwxwZLfNlwpsmF8izBmy3XC8KwIfGIoveuK2HBA00mUmCeSwE"
);
function Routing() {
	return (
		<Router>
			<Routes>
			<Route>
				<Route path="/" element={<Landing />} />
				<Route path="/auth" element={<Auth />} />
				<Route
					path="/orders"
					element={<ProtectedRoute element={Orders} redirectTo="/auth" />}
				/>
				<Route path="/category/:categoryName" element={<Results />} />
				<Route path="/products/:productId" element={<ProductDetail />} />
				<Route path="/cart" element={<Cart />} />
				 <Route
          path="/payment"
          element={
            <ProtectedRoute
              message={"You must login to pay"}
              redirect={"/payment"}
            >
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
		
        </Route>
		</Routes>
	
		</Router>
	);
}

export default Routing;