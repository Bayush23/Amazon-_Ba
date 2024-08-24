import axios from "axios";
const axiosInstance = axios.create({
	// baseURL: "http://localhost:5001/clone-fe8e8/us-central1/api",
	baseURL: "https://api-c66n435kta-uc.a.run.app",
});
export {axiosInstance}
