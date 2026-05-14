import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ShoreTankMeasurementData() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		date: "",
		installation: "",
		tankNumber: "",
		vessel: "",
		account: "",
		grade: "",
		// Dynamic Tank Dip Records Array
		tankMeasurements: [
			{
				tankNumberDetail: "",
				overallDip: "",
				productDip: "",
				temperature: "",
				time: "",
			},
		],
		// Checkboxes
		beforeDischarge: false,
		afterDischarge: false,
		upper: false,
		middle: false,
		lower: false,
		running: false,
		profile: false,
		numberOfSamples: "",
		// Reason checkboxes
		reasonDensity: false,
		reasonAnalysis: false,
		reasonRetention: false,
		remarks: "",
		intertekInspector: "",
		// Dynamic Representatives Array matching your SOF/Sealing layouts
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	// General inputs
	const handleChange = (e) => {
		const { id, type, checked, value } = e.target;
		setFormData({
			...formData,
			[id]: type === "checkbox" ? checked : value,
		});
	};

	// --- DYNAMIC TANK MEASUREMENTS LOGIC ---
	const handleMeasurementChange = (index, e) => {
		const newMeasurements = [...formData.tankMeasurements];
		newMeasurements[index][e.target.name] = e.target.value;
		setFormData({ ...formData, tankMeasurements: newMeasurements });
	};

	const addMeasurement = () => {
		setFormData({
			...formData,
			tankMeasurements: [
				...formData.tankMeasurements,
				{
					tankNumberDetail: "",
					overallDip: "",
					productDip: "",
					temperature: "",
					time: "",
				},
			],
		});
	};

	const removeMeasurement = (index) => {
		if (formData.tankMeasurements.length > 1) {
			const newMeasurements = formData.tankMeasurements.filter(
				(_, i) => i !== index,
			);
			setFormData({ ...formData, tankMeasurements: newMeasurements });
		}
	};

	// --- DYNAMIC REPRESENTATIVE LOGIC ---
	const handleRepChange = (index, e) => {
		const newReps = [...formData.representatives];
		newReps[index][e.target.name] = e.target.value;
		setFormData({ ...formData, representatives: newReps });
	};

	const addRep = () => {
		setFormData({
			...formData,
			representatives: [
				...formData.representatives,
				{ name: "", id: "", email: "" },
			],
		});
	};

	const removeRep = (index) => {
		if (formData.representatives.length > 1) {
			const newReps = formData.representatives.filter((_, i) => i !== index);
			setFormData({ ...formData, representatives: newReps });
		}
	};

	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/shoreTankMeasurementData/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				// Format date strictly for HTML5 input field
				const formattedData = {
					...data,
					date: data.date
						? new Date(data.date).toISOString().split("T")[0]
						: "",
				};

				setFormData(formattedData);
			} catch (error) {
				console.error("Fetch Error:", error);
			}
		};
		fetchStatus();
	}, [id]);

	const handleSave = async () => {
		if (!currentUser) return alert("You must be logged in to save!");
		setLoading(true);
		try {
			const res = await fetch("/api/shoreTankMeasurementData/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
					...(id && { _id: id }),
				}),
			});
			const data = await res.json();

			if (data.success !== false) {
				alert("Shore Tank Measurement Record Saved!");
				if (!id && data._id) {
					navigate(`/shoreTankMeasurementData/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to save");
			}
		} catch (err) {
			console.error("Save Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif">
			<h1 className="text-2xl font-bold text-center mb-6 uppercase tracking-widest border-b-2 border-black pb-2">
				Shore Tank Measurement Data (Dip Ticket)
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Installation details and Tank dips */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8">
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Date
							</label>
							<input
								type="date"
								id="date"
								value={formData.date}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Installation
							</label>
							<input
								type="text"
								id="installation"
								value={formData.installation}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Tank Number
							</label>
							<input
								type="text"
								id="tankNumber"
								value={formData.tankNumber}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Vessel
							</label>
							<input
								type="text"
								id="vessel"
								value={formData.vessel}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
							/>
						</div>
						<div className="col-span-2">
							<label className="text-xs font-bold uppercase text-gray-500">
								Account
							</label>
							<input
								type="text"
								id="account"
								value={formData.account}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
							/>
						</div>
						<div className="col-span-2">
							<label className="text-xs font-bold uppercase text-gray-500">
								Grade
							</label>
							<input
								type="text"
								id="grade"
								value={formData.grade}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
							/>
						</div>
					</div>

					<div className="flex justify-between items-center bg-black text-white p-1 mb-4">
						<h2 className="text-sm font-bold uppercase">
							Tank Measurement Details
						</h2>
						<button
							type="button"
							onClick={addMeasurement}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Tank Measurement
						</button>
					</div>

					{formData.tankMeasurements.map((measurement, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-4"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeMeasurement(index)}
									className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
								>
									&times;
								</button>
							)}

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Tank Number
										</label>
										<input
											type="text"
											name="tankNumberDetail"
											value={measurement.tankNumberDetail || ""}
											onChange={(e) => handleMeasurementChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Overall Dip
										</label>
										<input
											type="text"
											name="overallDip"
											value={measurement.overallDip || ""}
											onChange={(e) => handleMeasurementChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
										/>
									</div>
								</div>

								<div className="grid grid-cols-3 gap-2">
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Product Dip
										</label>
										<input
											type="text"
											name="productDip"
											value={measurement.productDip || ""}
											onChange={(e) => handleMeasurementChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Temperature
										</label>
										<input
											type="text"
											name="temperature"
											value={measurement.temperature || ""}
											onChange={(e) => handleMeasurementChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Time
										</label>
										<input
											type="time"
											name="time"
											value={measurement.time || ""}
											onChange={(e) => handleMeasurementChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* RIGHT COLUMN: Samples Checklist, Remarks, Authorization */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between">
					<div className="space-y-6">
						<h2 className="text-sm font-bold bg-black text-white p-1 uppercase">
							Sampling Matrix Checklist
						</h2>

						<div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded border border-gray-100">
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
								<input
									type="checkbox"
									id="beforeDischarge"
									checked={formData.beforeDischarge}
									onChange={handleChange}
									className="accent-black"
								/>
								Before Discharge
							</label>
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
								<input
									type="checkbox"
									id="afterDischarge"
									checked={formData.afterDischarge}
									onChange={handleChange}
									className="accent-black"
								/>
								After Discharge
							</label>
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
								<input
									type="checkbox"
									id="upper"
									checked={formData.upper}
									onChange={handleChange}
									className="accent-black"
								/>
								Upper
							</label>
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
								<input
									type="checkbox"
									id="middle"
									checked={formData.middle}
									onChange={handleChange}
									className="accent-black"
								/>
								Middle
							</label>
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
								<input
									type="checkbox"
									id="lower"
									checked={formData.lower}
									onChange={handleChange}
									className="accent-black"
								/>
								Lower
							</label>
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
								<input
									type="checkbox"
									id="running"
									checked={formData.running}
									onChange={handleChange}
									className="accent-black"
								/>
								Running
							</label>
							<label className="flex items-center gap-2 text-xs uppercase cursor-pointer col-span-2">
								<input
									type="checkbox"
									id="profile"
									checked={formData.profile}
									onChange={handleChange}
									className="accent-black"
								/>
								Profile
							</label>
						</div>

						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Number of Samples
							</label>
							<input
								type="text"
								id="numberOfSamples"
								value={formData.numberOfSamples}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
							/>
						</div>

						<div>
							<h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
								Reason for Sampling:
							</h3>
							<div className="flex gap-4 p-2 bg-gray-50 rounded border border-gray-100">
								<label className="flex items-center gap-1 text-xs uppercase cursor-pointer">
									<input
										type="checkbox"
										id="reasonDensity"
										checked={formData.reasonDensity}
										onChange={handleChange}
										className="accent-black"
									/>
									Density
								</label>
								<label className="flex items-center gap-1 text-xs uppercase cursor-pointer">
									<input
										type="checkbox"
										id="reasonAnalysis"
										checked={formData.reasonAnalysis}
										onChange={handleChange}
										className="accent-black"
									/>
									Analysis
								</label>
								<label className="flex items-center gap-1 text-xs uppercase cursor-pointer">
									<input
										type="checkbox"
										id="reasonRetention"
										checked={formData.reasonRetention}
										onChange={handleChange}
										className="accent-black"
									/>
									Retention
								</label>
							</div>
						</div>

						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Remarks
							</label>
							<textarea
								id="remarks"
								value={formData.remarks}
								onChange={handleChange}
								rows="2"
								className="w-full border border-black outline-none p-2 focus:bg-gray-50 font-sans text-sm mt-1"
							/>
						</div>

						<h2 className="text-sm font-bold border-b border-black uppercase">
							Authorization
						</h2>

						<div>
							<label className="text-xs font-bold text-gray-400 uppercase">
								Intertek Inspector Name
							</label>
							<input
								type="text"
								id="intertekInspector"
								value={formData.intertekInspector}
								onChange={handleChange}
								placeholder="Full Name"
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50 transition-all"
							/>
						</div>

						<div className="space-y-4">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">Representatives</h2>
								<button
									type="button"
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold"
								>
									+ ADD REP
								</button>
							</div>

							{formData.representatives.map((rep, index) => (
								<div
									key={index}
									className="p-3 bg-gray-50 rounded-lg relative border border-gray-100 mb-2"
								>
									{index > 0 && (
										<button
											type="button"
											onClick={() => removeRep(index)}
											className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
										>
											&times;
										</button>
									)}

									<div className="space-y-3">
										<div>
											<label className="text-[10px] font-bold text-gray-400 uppercase">
												Representative Name
											</label>
											<input
												type="text"
												name="name"
												value={rep.name || ""}
												onChange={(e) => handleRepChange(index, e)}
												className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											/>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="text-[10px] font-bold text-gray-400 uppercase">
													ID Number
												</label>
												<input
													type="text"
													name="id"
													value={rep.id || ""}
													onChange={(e) => handleRepChange(index, e)}
													className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
												/>
											</div>
											<div>
												<label className="text-[10px] font-bold text-gray-400 uppercase">
													Email Address
												</label>
												<input
													type="email"
													name="email"
													value={rep.email || ""}
													onChange={(e) => handleRepChange(index, e)}
													className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
												/>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<button
						onClick={handleSave}
						disabled={loading}
						className="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest"
					>
						{loading ? "Saving Document..." : "Save Measurement Record"}
					</button>
				</div>
			</div>
		</main>
	);
}
