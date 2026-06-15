import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function signUp() {
	//create a piece of state to track all the changes
	const [formData, setFormData] = useState({});
	//create a piece of state for the error
	const [error, setError] = useState(null);
	//create piece of state for the loading
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const res = await fetch("/api/auth/signUp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				setLoading(false);
				setError(data.message);

				return;
			}
			setLoading(false);
			setError(null);
			navigate("/signIn");
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
				<input
					type="text"
					placeholder="Username"
					className="border p-3 rounded-lg"
					id="username"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="Email"
					className="border p-3 rounded-lg"
					id="email"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="PIN"
					className="border p-3 rounded-lg"
					id="password"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
				>
					{loading ? "Loading..." : "Sign Up"}
				</button>
				<OAuth />
			</form>
			<div className="flex gap-2 mt-5">
				<p>Have an account?</p>
				<Link to={"/signIn"}>
					<span className="text-blue-700">Sign In</span>
				</Link>
			</div>
			{error && <p className="text-red-500 mt-5">{error}</p>}
		</div>
	);
}
