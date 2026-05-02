// Import Redux hooks to access global state and send actions
import { useSelector, useDispatch } from "react-redux";
// Import React hooks for DOM references, local state, and side effects
import { useRef, useState, useEffect } from "react";
// Import action creators for the update process lifecycle
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} from "../redux/user/userSlice.js";

export default function Profile() {
	// Create a reference to the hidden file input to trigger it via the profile image
	const fileRef = useRef(null);
	// Initialize dispatch to communicate with the Redux store
	const dispatch = useDispatch();
	// Pull user data, loading status, and error messages from the global 'user' state
	const { currentUser, loading, error } = useSelector((state) => state.user);
	// Local state to store the raw file object when a user selects an image
	const [file, setFile] = useState(undefined);

	// Local state to track the Cloudinary upload progress percentage (0 to 100)
	const [filePerc, setFilePerc] = useState(0);
	// Local state to track if the image upload to Cloudinary failed
	const [fileUploadError, setFileUploadError] = useState(false);
	// Local state to show a success message after the database update is finished
	const [updateSuccess, setUpdateSuccess] = useState(false);

	// Local state to store only the fields being updated (username, email, avatar, etc.)
	const [formData, setFormData] = useState({});

	// Side effect: whenever the 'file' state changes, start the upload process
	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	// Function to handle the asynchronous upload of the image file to Cloudinary
	const handleFileUpload = (file) => {
		// Set your unique Cloudinary account identifier (found in your Dashboard)
		const cloudName = "dnxmcdha2";
		// Set the 'Unsigned' upload preset name created in your Cloudinary settings
		const uploadPreset = "intertek";
		// Construct the official Cloudinary API URL using your cloud name
		const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

		// Create a new XMLHttpRequest object to handle the request and track upload progress
		const xhr = new XMLHttpRequest();
		// Create a FormData object to package the file and preset for a multi-part/form-data request
		const fd = new FormData();
		// Initialize the request: set the method to POST, the target URL, and make it asynchronous
		xhr.open("POST", url, true);

		// Logic: Listen for the 'progress' event to calculate how much of the file has been sent
		xhr.upload.addEventListener("progress", (e) => {
			// Calculate the percentage: (bytes uploaded / total bytes) * 100
			const progress = Math.round((e.loaded * 100.0) / e.total);
			// Update the local state to show the percentage in the UI (e.g., "Uploading 50%")
			setFilePerc(progress);
		});

		// Logic: Listen for the request completion or status changes
		xhr.onreadystatechange = () => {
			// readyState 4 means the communication with Cloudinary is completely finished
			if (xhr.readyState === 4) {
				// Status 200 means the image was successfully received and stored by Cloudinary
				if (xhr.status === 200) {
					// Parse the JSON string sent back by Cloudinary into a readable object
					const response = JSON.parse(xhr.responseText);
					// Logic: Extract the public URL (secure_url) and add it to our formData state
					setFormData({ ...formData, avatar: response.secure_url });
					// Reset the error state since the upload was successful
					setFileUploadError(false);
				} else {
					// If the status is not 200, log the error message from Cloudinary for debugging
					console.error("Cloudinary Error:", xhr.responseText);
					// Set the error state to true to display the "Error Image upload" message in UI
					setFileUploadError(true);
				}
			}
		};

		// Add the upload preset name to the form package (required for unsigned uploads)
		fd.append("upload_preset", uploadPreset);
		// Logic: Extract the first file from the file list and add it to the package
		// Note: file[0] is used because e.target.files returns a list, even for single files
		fd.append("file", file[0]);
		// Actually execute the request and send the data to the cloud
		xhr.send(fd);
	};

	// Update local formData state whenever a user types in an input field
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// Handle the final form submission to save data to your own backend
	const handleSubmit = async (e) => {
		e.preventDefault(); // Stop the page from refreshing
		try {
			dispatch(updateUserStart()); // Set loading state to true in Redux
			// Send the updated data to your Node.js API
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST", // HTTP method defined in your backend routes
				headers: { "Content-Type": "application/json" }, // Tell backend to expect JSON
				body: JSON.stringify(formData), // Convert state object to JSON string
			});
			const data = await res.json(); // Parse the response from your server
			if (data.success === false) {
				dispatch(updateUserFailure(data.message)); // Send error to Redux if update failed
				return;
			}
			dispatch(updateUserSuccess(data)); // Save updated user info to Redux on success
			setUpdateSuccess(true); // Show the success message at the bottom of the form
		} catch (error) {
			dispatch(updateUserFailure(error.message)); // Catch network errors
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				{/* Hidden file input that only accepts images */}
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setFile(e.target.files)}
				/>
				{/* Profile image that acts as a button to trigger the hidden file input */}
				<img
					onClick={() => fileRef.current.click()}
					src={formData.avatar || currentUser.avatar}
					alt="profile"
					className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
				/>

				{/* Display upload status messages (Error, Progress, or Success) */}
				<p className="text-sm self-center">
					{fileUploadError ? (
						<span className="text-red-700">
							Error Image upload (file must be less than 2MB)
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
					) : filePerc === 100 ? (
						<span className="text-green-700">Image successfully uploaded!</span>
					) : (
						""
					)}
				</p>

				{/* Input fields synced with database keys (username, email, password) using 'id' */}
				<input
					onChange={handleChange}
					type="text"
					placeholder="username"
					id="username"
					defaultValue={currentUser.username}
					className="border p-3 rounded-lg shadow-md"
				/>
				<input
					onChange={handleChange}
					type="email"
					placeholder="email"
					id="email"
					defaultValue={currentUser.email}
					className="border p-3 rounded-lg shadow-md"
				/>
				<input
					onChange={handleChange}
					type="password"
					placeholder="password"
					id="password"
					className="border p-3 rounded-lg shadow-md"
				/>
				{/* Submit button: disabled while the request is loading to prevent duplicate entries */}
				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80"
				>
					{loading ? "Loading..." : "Update"}
				</button>
			</form>

			{/* Global error messages from Redux */}
			<p className="text-red-700 mt-5 text-center">{error ? error : ""}</p>
			{/* Local success message after database update */}
			<p className="text-green-700 mt-5 text-center">
				{updateSuccess ? "User updated successfully!" : ""}
			</p>
		</div>
	);
}
