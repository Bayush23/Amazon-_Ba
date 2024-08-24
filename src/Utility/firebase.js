import firebase from "firebase/compat/app";
//auth
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAjfRzGhEx2zud-nIHmxYrRAzruqoolB48",
	authDomain: "clone-fe8e8.firebaseapp.com",
	projectId: "clone-fe8e8",
	storageBucket: "clone-fe8e8.appspot.com",
	messagingSenderId: "782857397307",
	appId: "1:782857397307:web:a570f483418a726886e81e",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();
