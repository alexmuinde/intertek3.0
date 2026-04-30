import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
/**const configureStore = require("@reduxjs/toolkit");
const { useReducer } = require("./user/userSlice.js"); */

export const store = configureStore({
	reducer: { user: userReducer },
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

/**const store = configureStore({
	reducer: { user: useReducer },
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
modules.exports = store; */
