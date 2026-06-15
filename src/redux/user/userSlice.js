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
			state.loading = true;
			state.error = null;
		},
		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		signInFailure: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		// --- ADDED FOR PROFILE UPDATE ---
		updateUserStart: (state) => {
			state.loading = true;
			state.error = null; // Clear old errors when starting a new update
		},
		updateUserSuccess: (state, action) => {
			state.currentUser = action.payload; // Replace old user data with updated data
			state.loading = false;
			state.error = null;
		},
		updateUserFailure: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const {
	signInStart,
	signInSuccess,
	signInFailure,
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
