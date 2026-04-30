import { createSlice } from "@reduxjs/toolkit";

//create the initial state
const initialState = {
	currentUser: null,
	error: null,
	loading: false,
};

//create the user slice
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signInStart: (state) => {
			state.loading - true;
		},
		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		signInFailure: (state, action) => {
			state.action = action.payload;
			state.loading = false;
		},
	},
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;
