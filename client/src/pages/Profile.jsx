import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Settings, ChevronUp, FileText, Scale } from "lucide-react";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} from "../redux/user/userSlice.js";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const fileRef = useRef(null);

	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const [userDocs, setUserDocs] = useState({ weighBridges: [], sof: [] });
	const [loadingDocs, setLoadingDocs] = useState(true);
	const [activeTab, setActiveTab] = useState("WB");

	useEffect(() => {
		if (file) handleFileUpload(file[0]);
	}, [file]);

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
				setUserDocs({
					weighBridges: Array.isArray(wbData) ? wbData : wbData.data || [],
					sof: Array.isArray(sofData) ? sofData : sofData.data || [],
				});
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingDocs(false);
			}
		};
		if (currentUser?._id) fetchUserDocs();
	}, [currentUser?._id]);

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.id]: e.target.value });

	const handleFileUpload = (file) => {
		const cloudName = "dnxmcdha2";
		const uploadPreset = "intertek";
		const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
		const xhr = new XMLHttpRequest();
		const fd = new FormData();
		xhr.open("POST", url, true);
		xhr.upload.addEventListener("progress", (e) =>
			setFilePerc(Math.round((e.loaded * 100.0) / e.total)),
		);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				setFormData({
					...formData,
					avatar: JSON.parse(xhr.responseText).secure_url,
				});
				setFileUploadError(false);
			} else if (xhr.readyState === 4) setFileUploadError(true);
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
				method: "POST", // Ensure this matches your backend router.post
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();

			if (data.success === false) {
				return dispatch(updateUserFailure(data.message));
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
			setFormData({}); // Clear temporary state after saving to database
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-4 font-serif">
			<div className="flex flex-col lg:flex-row gap-8 items-start">
				{/* LEFT: Profile Section - Shrinks to Badge on Mobile unless Expanded */}
				<div
					className={`transition-all duration-500 ease-in-out border border-gray-100 shadow-sm overflow-hidden
					${
						isExpanded
							? "w-full bg-white p-6 rounded-xl"
							: "w-full lg:w-1/3 bg-gray-50 p-2 rounded-full lg:rounded-xl lg:bg-white lg:p-6"
					}`}
				>
					{/* Mobile/Collapsed Badge */}
					<div
						onClick={() => setIsExpanded(!isExpanded)}
						className={`flex items-center gap-3 lg:hidden ${isExpanded ? "hidden" : "flex"}`}
					>
						<img
							src={currentUser.avatar}
							className="h-10 w-10 rounded-full object-cover border border-gray-200"
							alt=""
						/>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-bold text-slate-800 truncate">
								{currentUser.username}
							</p>
							<p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">
								Edit Settings
							</p>
						</div>
						<Settings size={18} className="text-gray-400 mr-2" />
					</div>

					{/* Form Content - Desktop always visible, Mobile toggleable */}
					<div
						className={`transition-all duration-500 ${isExpanded ? "opacity-100 max-h-[1000px]" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"}`}
					>
						<div className="flex justify-between items-center mb-6 border-b pb-2">
							<h2 className="text-lg font-bold text-slate-800">
								Profile Settings
							</h2>
							<button
								onClick={() => setIsExpanded(false)}
								className="lg:hidden p-1"
							>
								<ChevronUp size={20} />
							</button>
						</div>
						<form onSubmit={handleSubmit} className="flex flex-col gap-5">
							<input
								type="file"
								ref={fileRef}
								hidden
								accept="image/*"
								onChange={(e) => setFile(e.target.files)}
							/>
							<img
								onClick={() => fileRef.current.click()}
								src={formData.avatar || currentUser.avatar}
								alt="profile"
								className="rounded-full h-24 w-24 self-center cursor-pointer border-4 border-gray-50 object-cover"
							/>
							<div className="space-y-4">
								<input
									onChange={handleChange}
									type="text"
									id="username"
									defaultValue={currentUser.username}
									className="w-full border p-3 rounded-lg text-sm bg-gray-50 outline-none"
								/>
								<input
									onChange={handleChange}
									type="email"
									id="email"
									defaultValue={currentUser.email}
									className="w-full border p-3 rounded-lg text-sm bg-gray-50 outline-none"
								/>
								<button
									disabled={loading}
									className="w-full bg-slate-900 text-white rounded-lg p-3 uppercase font-bold text-xs hover:bg-black transition-all shadow-lg"
								>
									{loading ? "Syncing..." : "Update Credentials"}
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* RIGHT: Workspace Dashboard */}
				<div className="flex-[2] w-full flex flex-col gap-6">
					<h2 className="text-xl font-bold text-slate-800 border-b pb-2">
						My Workspace
					</h2>

					{/* Document Type Selectors */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div
							onClick={() => setActiveTab("WB")}
							className={`cursor-pointer p-5 rounded-xl border-l-8 transition-all flex items-center justify-between ${activeTab === "WB" ? "bg-green-50 border-green-600 shadow-md" : "bg-white border-gray-200 opacity-60"}`}
						>
							<div>
								<h3 className="font-bold text-green-800 text-xs uppercase">
									WeighBridge
								</h3>
								<p className="text-3xl font-black text-green-900">
									{userDocs.weighBridges.length}
								</p>
							</div>
							<Scale
								className={
									activeTab === "WB" ? "text-green-600" : "text-gray-300"
								}
								size={32}
							/>
						</div>

						<div
							onClick={() => setActiveTab("SOF")}
							className={`cursor-pointer p-5 rounded-xl border-l-8 transition-all flex items-center justify-between ${activeTab === "SOF" ? "bg-blue-50 border-blue-600 shadow-md" : "bg-white border-gray-200 opacity-60"}`}
						>
							<div>
								<h3 className="font-bold text-blue-800 text-xs uppercase">
									Statement of Facts
								</h3>
								<p className="text-3xl font-black text-blue-900">
									{userDocs.sof.length}
								</p>
							</div>
							<FileText
								className={
									activeTab === "SOF" ? "text-blue-600" : "text-gray-300"
								}
								size={32}
							/>
						</div>
					</div>

					{/* Document Table */}
					<div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-100">
									<th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
										{activeTab === "WB"
											? "Truck & Loading Site"
											: "Vessel & Port"}
									</th>
									<th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-center">
										Total:{" "}
										{activeTab === "WB"
											? userDocs.weighBridges.length
											: userDocs.sof.length}
									</th>
									<th className="p-4 text-right">
										<Link
											to={
												activeTab === "WB"
													? "/wheighBridge"
													: "/statementOfFacts"
											}
											className={`px-3 py-1.5 rounded text-[10px] font-bold text-white uppercase ${activeTab === "WB" ? "bg-green-600" : "bg-blue-600"}`}
										>
											+ NEW
										</Link>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{loadingDocs ? (
									<tr>
										<td
											colSpan="3"
											className="p-8 text-center text-xs italic text-gray-400"
										>
											Loading records...
										</td>
									</tr>
								) : (activeTab === "WB" ? userDocs.weighBridges : userDocs.sof)
										.length > 0 ? (
									(activeTab === "WB"
										? userDocs.weighBridges
										: userDocs.sof
									).map((doc) => (
										<tr
											key={doc._id}
											className="hover:bg-gray-50/50 transition-colors group"
										>
											<td className="p-4">
												<div className="flex flex-col">
													{/* Row Title based on Doc Type */}
													<span className="font-bold text-slate-700 text-sm">
														{activeTab === "WB"
															? doc.truckNumber || "N/A"
															: doc.vessel || "N/A"}
													</span>

													<span className="text-[9px] text-gray-300 font-mono mt-1 italic">
														Created:{" "}
														{new Date(doc.createdAt).toLocaleDateString()}
													</span>
												</div>
											</td>
											<td className="p-4 text-center">
												{/* This section remains the primary display for the main data fields */}
												<span
													className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-tight ${
														activeTab === "WB"
															? "bg-green-50 text-green-700 border border-green-100"
															: "bg-blue-50 text-blue-700 border border-blue-100"
													}`}
												>
													{activeTab === "WB"
														? doc.placeOfLoading || "N/A"
														: doc.port || "N/A"}
												</span>
											</td>

											<td className="p-4 text-right">
												<Link
													to={`/${activeTab === "WB" ? "wheighBridge" : "statementOfFacts"}/${doc._id}`}
													className="text-[10px] font-bold text-slate-400 group-hover:text-black transition-colors underline underline-offset-4"
												>
													OPEN DETAIL
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="3"
											className="p-12 text-center text-gray-300 text-sm italic font-serif"
										>
											No {activeTab === "WB" ? "WeighBridge" : "SOF"} documents
											found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
