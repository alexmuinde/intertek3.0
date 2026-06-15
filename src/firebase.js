// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "intertek-48664.firebaseapp.com",
	projectId: "intertek-48664",
	storageBucket: "intertek-48664.firebasestorage.app",
	messagingSenderId: "360933565568",
	appId: "1:360933565568:web:855f95a4295e66b801b265",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
