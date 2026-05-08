import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} from "../redux/user/userSlice.js";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const fileRef = useRef(null);

	// Profile Form States
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);

	// Workspace/Dashboard States
	const [userDocs, setUserDocs] = useState({ weighBridges: [], sof: [] });
	const [loadingDocs, setLoadingDocs] = useState(true);
	const [activeTab, setActiveTab] = useState("WB");

	// Trigger image upload whenever a file is selected
	useEffect(() => {
		if (file) handleFileUpload(file[0]);
	}, [file]);

	// Fetch documents only belonging to current user
	useEffect(() => {
		const fetchUserDocs = async () => {
			try {
				setLoadingDocs(true);
				const [wbRes, sofRes] = await Promise.all([
					fetch(`/api/wheighBridge/getall`),
					fetch(`/api/statementOfFacts/getall`),
				]);

				const wbData = await wbRes.json();
				const sofData = await sofRes.json();

				// Debugging: Check your console to see what the empty one looks like
				console.log("WB Data:", wbData);
				console.log("SOF Data:", sofData);

				setUserDocs({
					// Ensure we handle both direct arrays and {success, data} wrappers
					weighBridges: Array.isArray(wbData) ? wbData : wbData.data || [],
					sof: Array.isArray(sofData) ? sofData : sofData.data || [],
				});
			} catch (err) {
				console.error("Dashboard Load Error:", err);
			} finally {
				setLoadingDocs(false);
			}
		};
		if (currentUser?._id) fetchUserDocs();
	}, [currentUser._id]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleFileUpload = (file) => {
		const cloudName = "dnxmcdha2";
		const uploadPreset = "intertek";
		const url = `https://cloudinary.com{cloudName}/image/upload`;
		const xhr = new XMLHttpRequest();
		const fd = new FormData();
		xhr.open("POST", url, true);

		xhr.upload.addEventListener("progress", (e) => {
			const progress = Math.round((e.loaded * 100.0) / e.total);
			setFilePerc(progress);
		});

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.responseText);
					setFormData({ ...formData, avatar: response.secure_url });
					setFileUploadError(false);
				} else {
					setFileUploadError(true);
				}
			}
		};
		fd.append("upload_preset", uploadPreset);
		fd.append("file", file);
		xhr.send(fd);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}
			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-4 font-serif">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT: Profile Form */}
				<div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
					<h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">
						Profile Settings
					</h2>
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<input
							type="file"
							ref={fileRef}
							hidden
							accept="image/*"
							onChange={(e) => setFile(e.target.files)}
						/>
						<div className="relative self-center group">
							<img
								onClick={() => fileRef.current.click()}
								src={formData.avatar || currentUser.avatar}
								alt="profile"
								className="rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-gray-50 group-hover:opacity-90 transition-all"
							/>
							{filePerc > 0 && filePerc < 100 && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white text-xs font-bold">
									{filePerc}%
								</div>
							)}
						</div>
						<p className="text-[10px] text-center uppercase tracking-widest font-bold">
							{fileUploadError ? (
								<span className="text-red-500">Upload Failed</span>
							) : filePerc === 100 ? (
								<span className="text-green-600">Sync Complete</span>
							) : (
								"Click image to change"
							)}
						</p>

						<div className="space-y-4">
							<input
								onChange={handleChange}
								type="text"
								id="username"
								defaultValue={currentUser.username}
								className="w-full border p-3 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none transition-all"
								placeholder="Username"
							/>
							<input
								onChange={handleChange}
								type="email"
								id="email"
								defaultValue={currentUser.email}
								className="w-full border p-3 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none transition-all"
								placeholder="Email"
							/>
							<input
								onChange={handleChange}
								type="password"
								id="password"
								className="w-full border p-3 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none transition-all"
								placeholder="New Password"
							/>
						</div>

						<button
							disabled={loading}
							className="bg-slate-900 text-white rounded-lg p-3 uppercase font-bold text-xs hover:bg-black disabled:bg-slate-400 transition-all shadow-lg"
						>
							{loading ? "Syncing..." : "Update Credentials"}
						</button>
					</form>
					{updateSuccess && (
						<p className="text-green-600 text-xs mt-4 text-center font-bold">
							Account updated successfully!
						</p>
					)}
					{error && (
						<p className="text-red-600 text-xs mt-4 text-center">{error}</p>
					)}
				</div>

				{/* RIGHT: Workspace Dashboard */}
				<div className="flex-[2] flex flex-col gap-6">
					<h2 className="text-xl font-bold text-slate-800 border-b pb-2">
						My Workspace
					</h2>

					{/* Navigation Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div
							onClick={() => setActiveTab("WB")}
							className={`cursor-pointer p-5 rounded-lg border-l-8 transition-all ${activeTab === "WB" ? "bg-green-50 border-green-600 shadow-md ring-1 ring-green-200" : "bg-white border-gray-200 opacity-60 hover:opacity-100 shadow-sm"}`}
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-bold text-green-800 text-xs uppercase tracking-tighter">
									WeighBridge Records
								</h3>
								<Link
									to="/wheighBridge"
									className="bg-green-600 text-white text-[9px] px-2 py-1 rounded font-bold hover:bg-green-700"
								>
									+ NEW
								</Link>
							</div>
							<p className="text-4xl font-black text-green-900">
								{userDocs.weighBridges.length}
							</p>
						</div>

						<div
							onClick={() => setActiveTab("SOF")}
							className={`cursor-pointer p-5 rounded-lg border-l-8 transition-all ${activeTab === "SOF" ? "bg-blue-50 border-blue-600 shadow-md ring-1 ring-blue-200" : "bg-white border-gray-200 opacity-60 hover:opacity-100 shadow-sm"}`}
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-bold text-blue-800 text-xs uppercase tracking-tighter">
									Statement of Facts
								</h3>
								<Link
									to="/statementOfFacts"
									className="bg-blue-600 text-white text-[9px] px-2 py-1 rounded font-bold hover:bg-blue-700"
								>
									+ NEW
								</Link>
							</div>
							<p className="text-4xl font-black text-blue-900">
								{userDocs.sof.length}
							</p>
						</div>
					</div>

					{/* List Table */}
					<div className="bg-white border rounded-xl overflow-hidden shadow-sm">
						<div
							className={`px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest ${activeTab === "WB" ? "bg-green-800" : "bg-blue-800"}`}
						>
							Viewing{" "}
							{activeTab === "WB" ? "Logistics Records" : "Vessel Operations"}
						</div>
						<div className="max-h-[500px] overflow-y-auto">
							{loadingDocs ? (
								<div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase text-xs">
									Accessing Database...
								</div>
							) : (activeTab === "WB" ? userDocs.weighBridges : userDocs.sof)
									.length === 0 ? (
								<div className="p-20 text-center text-gray-300 italic">
									Empty Archive
								</div>
							) : (
								<table className="w-full text-left border-collapse">
									<thead className="bg-gray-50/50 sticky top-0 text-[10px] uppercase text-gray-500 font-bold border-b">
										<tr>
											<th className="px-6 py-3">
												{activeTab === "WB" ? "Truck Number" : "Vessel Name"}
											</th>
											<th className="px-6 py-3">Last Modified</th>
											<th className="px-6 py-3 text-right">Link</th>
										</tr>
									</thead>
									<tbody className="text-sm">
										{(activeTab === "WB"
											? userDocs.weighBridges
											: userDocs.sof
										).map((doc) => (
											<tr key={doc._id} className="border-t hover:bg-gray-50">
												<td className="px-4 py-3 font-medium">
													{/* Your SOF JSON uses 'vessel', make sure WB uses 'truckNumber' */}
													{activeTab === "WB" ? doc.truckNumber : doc.vessel}
												</td>
												<td className="px-4 py-3 text-gray-500">
													{new Date(doc.updatedAt).toLocaleDateString()}
												</td>
												<td className="px-4 py-3 text-right">
													<Link
														to={
															activeTab === "WB"
																? `/wheighBridge/${doc._id}`
																: `/statementOfFacts/${doc._id}`
														}
														className="text-blue-600 font-bold"
													>
														Edit
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
