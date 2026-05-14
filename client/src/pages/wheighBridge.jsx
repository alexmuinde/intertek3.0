// Import Redux for user context and React hooks for form state and navigation
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function WheighBridge() {
	// 1. Workflow: Pull current user to link this document to the surveyor
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const { id } = useParams();

	// 2. Logic: Track UI feedback (loading and error messages)
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	// 3. Workflow: Initial state containing EVERY field from the original HTML
	const [formData, setFormData] = useState({
		userRef: currentUser._id,
		intertekSurveyor: "",
		placeOfLoading: "",
		client: "",
		transportCompany: "",
		dateOfLoading: "",
		timeOfInspection: "",
		truckCommencedLoading: "",
		truckCompletedLoading: "",
		vessel: "",
		grade: "",
		density: "",
		shoreTankNo: "",
		temperature: "",
		truckNumber: "",
		driversName: "",
		driversId: "",
		grossWeight: "",
		tareWeight: "",
		nettWeight: "",
		cumulativeWeight: "",
		weighbridgeReceipt: "",
		previousCargo: "",
		trackSealedBy: "",
		bottomSeals: [""],
		topSeals: [""],
		// Checkboxes
		isClean: false,
		hasSpareWheel: false,
		waterContainerEmpty: false,
		isVehicleEmpty: false,
		nothingAttached: false,
	});

	useEffect(() => {
		// Only fetch if there is an ID in the URL (Update Mode)
		if (id) {
			const fetchReport = async () => {
				setLoading(true);
				try {
					const res = await fetch(`/api/wheighBridge/get/${id}`);
					const data = await res.json();

					if (data.success !== false) {
						// Format dates to YYYY-MM-DD for HTML5 inputs
						const formattedData = {
							...data,
							dateOfLoading: data.dateOfLoading
								? data.dateOfLoading.split("T")[0]
								: "",
						};
						setFormData(formattedData);
					} else {
						setError(data.message);
					}
				} catch (err) {
					setError(true);
				} finally {
					setLoading(false);
				}
			};
			fetchReport();
		}
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(false);

		try {
			// If 'id' exists in URL, include it in body to trigger an Update in the backend
			const body = id ? { ...formData, _id: id } : formData;

			const res = await fetch("/api/wheighBridge/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();

			if (data.success !== false) {
				alert("Record Saved!");

				// If it was a NEW record, redirect to its unique update URL
				if (!id && data._id) {
					navigate(`/wheighBridge/${data._id}`);
				}
				// If already updating, the UI stays current
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError("Failed to connect to server");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { id, value, type, checked } = e.target;
		setFormData({
			...formData,
			[id]: type === "checkbox" ? checked : value,
		});
	};

	// Function to add a new empty field to a specific seal list
	const handleAddSeal = (field) => {
		setFormData({
			...formData,
			[field]: [...formData[field], ""],
		});
	};
	// Specialized handler for array fields (seals)
	const handleSealChange = (index, value, field) => {
		const updatedSeals = [...formData[field]];
		updatedSeals[index] = value;
		setFormData({ ...formData, [field]: updatedSeals });
	};

	const handleRemoveSeal = (index, field) => {
		// Only allow removal if there is more than one field (optional)
		if (formData[field].length > 1) {
			setFormData({
				...formData,
				[field]: formData[field].filter((_, i) => i !== index),
			});
		}
	};

	// 6. Workflow: UI Styles (Sunken hover effect and subtle divider)
	const inputStyle =
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-sm";
	const labelStyle = "block text-[12px] pl-1 mb-1 text-gray-700 font-bold";

	return (
		<main className="p-4 max-w-6xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4">
				<h1 className="text-base font-bold text-center my-6 uppercase border-b-2 border-black pb-2">
					ROAD/ RAIL TANK SURVEY INSPECTION REPORT
				</h1>
				<p className="text-[12px] font-bold border-b border-gray-200 pb-1 mt-2 italic text-gray-600">
					To whom ever it may concern
				</p>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Logistics & Technicals */}
					<div className="flex-1 flex flex-col gap-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="md:col-span-2">
								<label className={labelStyle}>Intertek Surveyor</label>
								<input
									onChange={handleChange}
									id="intertekSurveyor"
									className={inputStyle}
									type="text"
									required
									value={formData.intertekSurveyor || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Place of Loading</label>
								<input
									onChange={handleChange}
									id="placeOfLoading"
									className={inputStyle}
									type="text"
									required
									value={formData.placeOfLoading || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Client</label>
								<input
									onChange={handleChange}
									id="client"
									className={inputStyle}
									type="text"
									required
									value={formData.client || ""}
								/>
							</div>
							<div className="md:col-span-2">
								<label className={labelStyle}>Transport Company</label>
								<input
									onChange={handleChange}
									id="transportCompany"
									className={inputStyle}
									type="text"
									required
									value={formData.transportCompany || ""}
								/>
							</div>
						</div>

						{/* Date & Time Section */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-gray-100 pb-4">
							<div>
								<label className={labelStyle}>Date</label>
								<input
									onChange={handleChange}
									id="dateOfLoading"
									className={inputStyle}
									type="date"
									required
									value={formData.dateOfLoading || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Inspection</label>
								<input
									onChange={handleChange}
									id="timeOfInspection"
									className={inputStyle}
									type="time"
									required
									value={formData.timeOfInspection || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Commenced</label>
								<input
									onChange={handleChange}
									id="truckCommencedLoading"
									className={inputStyle}
									type="time"
									required
									value={formData.truckCommencedLoading || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Completed</label>
								<input
									onChange={handleChange}
									id="truckCompletedLoading"
									className={inputStyle}
									type="time"
									required
									value={formData.truckCompletedLoading || ""}
								/>
							</div>
						</div>

						{/* Technical Specs */}
						<div className="grid grid-cols-3 gap-2">
							<div>
								<label className={labelStyle}>Vessel</label>
								<input
									onChange={handleChange}
									id="vessel"
									className={inputStyle}
									type="text"
									required
									value={formData.vessel || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Grade</label>
								<input
									onChange={handleChange}
									id="grade"
									className={inputStyle}
									type="text"
									required
									value={formData.grade || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Density</label>
								<input
									onChange={handleChange}
									id="density"
									className={inputStyle}
									type="text"
									required
									value={formData.density || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Shore Tank</label>
								<input
									onChange={handleChange}
									id="shoreTankNo"
									className={inputStyle}
									type="text"
									required
									value={formData.shoreTankNo || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Temp</label>
								<input
									onChange={handleChange}
									id="temperature"
									className={inputStyle}
									type="number"
									required
									value={formData.temperature || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Material</label>
								<input
									onChange={handleChange}
									id="constructionMaterial"
									className={inputStyle}
									type="text"
									required
									value={formData.constructionMaterial || ""}
								/>
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Weights, Seals & Checklist (With Subtle Divider) */}
					<div className="flex-1 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						{/* Vehicle & Weight Information */}
						<div className="grid grid-cols-3 gap-2">
							<div className="col-span-1">
								<label className={labelStyle}>Truck No.</label>
								<input
									onChange={handleChange}
									id="truckNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.truckNumber || ""}
								/>
							</div>
							<div className="col-span-1">
								<label className={labelStyle}>Driver</label>
								<input
									onChange={handleChange}
									id="driversName"
									className={inputStyle}
									type="text"
									required
									value={formData.driversName || ""}
								/>
							</div>
							<div className="col-span-1">
								<label className={labelStyle}>Driver ID</label>
								<input
									onChange={handleChange}
									id="driversId"
									className={inputStyle}
									type="text"
									required
									value={formData.driversId || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Gross</label>
								<input
									onChange={handleChange}
									id="grossWeight"
									className={inputStyle}
									type="number"
									required
									value={formData.grossWeight || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Tare</label>
								<input
									onChange={handleChange}
									id="tareWeight"
									className={inputStyle}
									type="number"
									required
									value={formData.tareWeight || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Nett</label>
								<input
									onChange={handleChange}
									id="nettWeight"
									className={inputStyle}
									type="number"
									required
									value={formData.nettWeight || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Cumulative</label>
								<input
									onChange={handleChange}
									id="cumulativeWeight"
									className={inputStyle}
									type="number"
									required
									value={formData.cumulativeWeight || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Receipt No.</label>
								<input
									onChange={handleChange}
									id="weighbridgeReceipt"
									className={inputStyle}
									type="number"
									required
									value={formData.weighbridgeReceipt || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Prev Cargo</label>
								<input
									onChange={handleChange}
									id="previousCargo"
									className={inputStyle}
									type="text"
									required
									value={formData.previousCargo || ""}
								/>
							</div>
						</div>

						{/* Certification & Seals */}
						<p className="text-[12px] p-2 bg-gray-50 italic">
							We certify that the above truck has been found to be clean and fit
							condition.
						</p>

						<div className="grid grid-cols-1 gap-3">
							<div>
								<label className={labelStyle}>Track Sealed By</label>
								<input
									onChange={handleChange}
									id="trackSealedBy"
									className={inputStyle}
									type="text"
									required
									value={formData.trackSealedBy || ""}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-4">
								{/* BOTTOM SEALS SECTION */}
								<div className="flex flex-col gap-3">
									<div className="flex justify-between items-center">
										<label className={labelStyle}>Bottom Seals</label>
										<button
											type="button"
											onClick={() => handleAddSeal("bottomSeals")}
											className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
										>
											+ ADD SEAL
										</button>
									</div>

									<div className="flex flex-col gap-2">
										{formData.bottomSeals.map((seal, index) => (
											<div
												key={index}
												className="flex items-center gap-2 group"
											>
												<input
													value={seal}
													onChange={(e) =>
														handleSealChange(
															index,
															e.target.value,
															"bottomSeals",
														)
													}
													className={`${inputStyle} flex-1`}
													placeholder={`Bottom Seal #${index + 1}`}
													required
												/>
												{formData.bottomSeals.length > 1 && (
													<button
														type="button"
														onClick={() =>
															handleRemoveSeal(index, "bottomSeals")
														}
														className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
														title="Remove Seal"
													>
														<svg
															xmlns="http://w3.org"
															width="16"
															height="16"
															fill="currentColor"
															viewBox="0 0 16 16"
														>
															<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
															<path
																fillRule="evenodd"
																d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
															/>
														</svg>
													</button>
												)}
											</div>
										))}
									</div>
								</div>

								{/* TOP SEALS SECTION */}
								<div className="flex flex-col gap-3">
									<div className="flex justify-between items-center">
										<label className={labelStyle}>Top Seals</label>
										<button
											type="button"
											onClick={() => handleAddSeal("topSeals")}
											className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
										>
											+ ADD SEAL
										</button>
									</div>

									<div className="flex flex-col gap-2">
										{formData.topSeals.map((seal, index) => (
											<div
												key={index}
												className="flex items-center gap-2 group"
											>
												<input
													value={seal}
													onChange={(e) =>
														handleSealChange(index, e.target.value, "topSeals")
													}
													className={`${inputStyle} flex-1`}
													placeholder={`Top Seal #${index + 1}`}
													required
												/>
												{formData.topSeals.length > 1 && (
													<button
														type="button"
														onClick={() => handleRemoveSeal(index, "topSeals")}
														className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
														title="Remove Seal"
													>
														<svg
															xmlns="http://w3.org"
															width="16"
															height="16"
															fill="currentColor"
															viewBox="0 0 16 16"
														>
															<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
															<path
																fillRule="evenodd"
																d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
															/>
														</svg>
													</button>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* FULL CHECKLIST (All 5 Items) */}
						<div className="flex flex-col gap-1 mt-2">
							{[
								{
									id: "isClean",
									label: "1. Compartments inspected & clean/dry?",
								},
								{
									id: "hasSpareWheel",
									label: "2. Vehicle fitted with spare wheel?",
								},
								{
									id: "waterContainerEmpty",
									label: "3. Water container empty?",
								},
								{ id: "isVehicleEmpty", label: "4. Anyone in the vehicle?" },
								{
									id: "nothingAttached",
									label: "5. Anything attached to vehicle?",
								},
							].map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-3 p-1 hover:bg-gray-50 border-b border-gray-100"
								>
									<input
										onChange={handleChange}
										type="checkbox"
										id={item.id}
										className="w-4 h-4 cursor-pointer"
										checked={formData[item.id] || false}
									/>
									<label
										htmlFor={item.id}
										className="text-[11px] cursor-pointer font-medium"
									>
										{item.label}
									</label>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* 7. Logic: Submission Footer */}
				<footer className="mt-4 border-t pt-6">
					<button
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md"
					>
						{loading ? "Submitting..." : "Submit Inspection Report"}
					</button>
					{error && (
						<p className="text-red-600 text-center mt-4 text-xs font-bold uppercase">
							{error}
						</p>
					)}
				</footer>
			</form>
		</main>
	);
}

/**import React from "react";

export default function WheighBridge() {
	return (
		<main className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-bold text center my-7 uppercase">
				Road/Rail Tank Survey Inspection Report
			</h1>
			<div>
				<label>Intertek Surveyor</label>
				<input
					type="text"
					placeholder="Intertek Surveyor"
					id="intertekSurveyor"
					required
					maxLength={62}
					minLength={10}
					className="border p-3 rounded-lg"
				/>
			</div>
		</main>
	);
}
 */
