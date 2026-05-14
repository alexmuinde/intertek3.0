import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EndOfPipelineSampleReport() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		location: "",
		product: "",
		installation: "",
		grade: "",
		pipeline: "",

		// Narrative paragraph states
		attendanceLocation: "",
		attendanceTime: "",
		attendanceDate: "",
		operationType: "discharge", // discharge, back-loading, transfer
		attendanceGrade: "",
		attendanceVessel: "",

		// Dynamic sample arrays with 2-minute default intervals
		sampleLogs: [
			{
				samplingTime: "",
				visualColour: "",
				waterPresence: "",
				otherMetrics: "",
			},
		],

		remarks: "",
		intertekInspector: "",
		// Dynamic authorized signing partners section mirroring Sealing Report layout
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC SAMPLING MATRIX ROW LOGIC ---
	const handleSampleLogChange = (index, e) => {
		const newSampleLogs = [...formData.sampleLogs];
		newSampleLogs[index][e.target.name] = e.target.value;
		setFormData({ ...formData, sampleLogs: newSampleLogs });
	};

	const addSampleRow = () => {
		setFormData({
			...formData,
			sampleLogs: [
				...formData.sampleLogs,
				{
					samplingTime: "",
					visualColour: "",
					waterPresence: "",
					otherMetrics: "",
				},
			],
		});
	};

	const removeSampleRow = (index) => {
		if (formData.sampleLogs.length > 1) {
			const newSampleLogs = formData.sampleLogs.filter((_, i) => i !== index);
			setFormData({ ...formData, sampleLogs: newSampleLogs });
		}
	};

	// --- DYNAMIC REPRESENTATIVE BLOCK MANIPULATION ---
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

	// --- LIFE-CYCLE ACCELERATOR DATA LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/endOfPipelineSampleReport/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				const formattedData = {
					...data,
					attendanceDate: data.attendanceDate
						? new Date(data.attendanceDate).toISOString().split("T")[0]
						: "",
				};

				setFormData(formattedData);
			} catch (error) {
				console.error("Fetch Data Sequence Failure:", error);
			}
		};
		fetchStatus();
	}, [id]);

	const handleSave = async (e) => {
		e.preventDefault();
		if (!currentUser)
			return alert("You must be logged in to save official reports!");
		setLoading(true);
		try {
			const res = await fetch("/api/endOfPipelineSampleReport/save", {
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
				alert("End of Pipeline Sample Report Saved Successfully!");
				if (!id && data._id) {
					navigate(`/endOfPipelineSampleReport/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to commit database payload execution.");
			}
		} catch (err) {
			console.error("Save Execution Error Trace:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif">
			<h1 className="text-2xl font-bold text-center mb-6 uppercase tracking-widest border-b-2 border-black pb-2">
				End Of Pipeline Sample Report
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT BLOCK: Logistics General Information & Dynamic Logs */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Vessel
							</label>
							<input
								type="text"
								id="vessel"
								onChange={handleChange}
								value={formData.vessel}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Location
							</label>
							<input
								type="text"
								id="location"
								onChange={handleChange}
								value={formData.location}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Product
							</label>
							<input
								type="text"
								id="product"
								onChange={handleChange}
								value={formData.product}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Installation
							</label>
							<input
								type="text"
								id="installation"
								onChange={handleChange}
								value={formData.installation}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Grade
							</label>
							<input
								type="text"
								id="grade"
								onChange={handleChange}
								value={formData.grade}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Pipeline
							</label>
							<input
								type="text"
								id="pipeline"
								onChange={handleChange}
								value={formData.pipeline}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
					</div>

					{/* Embedded Paragraph Statement Block */}
					<p className="p-3 bg-gray-50 rounded border border-gray-200 text-sm leading-relaxed text-gray-700">
						We attended at{" "}
						<input
							type="text"
							id="attendanceLocation"
							placeholder="Location"
							value={formData.attendanceLocation}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center w-28 text-sm"
							required
						/>
						{" at "}
						<input
							type="time"
							id="attendanceTime"
							value={formData.attendanceTime}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center text-sm"
							required
						/>
						{" , on the "}
						<input
							type="date"
							id="attendanceDate"
							value={formData.attendanceDate}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center text-xs"
							required
						/>
						{
							" to visually inspect the end of the pipe line sample report during "
						}
						<select
							id="operationType"
							value={formData.operationType}
							onChange={handleChange}
							className="border-b border-black bg-white font-bold px-1 text-sm cursor-pointer"
						>
							<option value="discharge">discharge</option>
							<option value="back-loading">back-loading</option>
							<option value="transfer">transfer</option>
						</select>
						{" of "} {/* ✅ Fixed string syntax error here */}
						<input
							type="text"
							id="attendanceGrade"
							placeholder="Grade"
							value={formData.attendanceGrade}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center w-24 text-sm"
							required
						/>
						{" ex "} {/* ✅ Fixed string syntax error here */}
						<input
							type="text"
							id="attendanceVessel"
							placeholder="Vessel"
							value={formData.attendanceVessel}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center w-28 text-sm"
							required
						/>
						{" and report as follows: "}{" "}
						{/* ✅ Fixed string syntax error here */}
					</p>

					{/* DYNAMIC SNAPSHOT METRICS REPEATER MATRIX */}
					<div className="flex justify-between items-center bg-black text-white p-1 mt-6">
						<h2 className="text-sm font-bold uppercase tracking-wider">
							Interval Sample Logging Log
						</h2>
						<button
							type="button"
							onClick={addSampleRow}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Sample Row
						</button>
					</div>

					{formData.sampleLogs.map((log, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-4"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeSampleRow(index)}
									className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
								>
									&times;
								</button>
							)}

							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Sampling Time
									</label>
									<input
										type="time"
										name="samplingTime"
										placeholder="e.g. 14:02"
										value={log.samplingTime || ""}
										onChange={(e) => handleSampleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-semibold"
										required
									/>
								</div>
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Visual Colour
									</label>
									<input
										type="text"
										name="visualColour"
										placeholder="Clear / Amber"
										value={log.visualColour || ""}
										onChange={(e) => handleSampleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-semibold"
										required
									/>
								</div>
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Water Presence
									</label>
									<input
										type="text"
										name="waterPresence"
										placeholder="Nil / Traces"
										value={log.waterPresence || ""}
										onChange={(e) => handleSampleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-semibold"
										required
									/>
								</div>
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Other
									</label>
									<input
										type="text"
										name="otherMetrics"
										placeholder="Free text note"
										value={log.otherMetrics || ""}
										onChange={(e) => handleSampleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-semibold"
										required
									/>
								</div>
							</div>
						</div>
					))}

					<div className="p-2 bg-yellow-50 text-[11px] text-yellow-800 border border-yellow-200 rounded font-sans italic">
						<strong>Note:</strong> Samples should be taken at a regular interval
						of 2 minutes.
					</div>
				</div>

				{/* RIGHT BLOCK: Remarks and Dynamic Signatures Panels */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Remarks
							</label>
							<input
								type="text"
								id="remarks"
								onChange={handleChange}
								value={formData.remarks}
								placeholder="Enter operational findings or remarks"
								className="w-full border-b border-black outline-none p-2 focus:bg-gray-50 text-sm font-medium"
								required
							/>
						</div>

						<h2 className="text-sm font-bold border-b border-black uppercase tracking-wider">
							Authorization
						</h2>
						<div>
							<label className="text-xs font-bold text-gray-400 uppercase">
								Intertek Inspector
							</label>
							<input
								type="text"
								id="intertekInspector"
								onChange={handleChange}
								value={formData.intertekInspector}
								placeholder="Inspector Full Name"
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50 text-sm font-bold transition-all"
								required
							/>
						</div>

						{/* CONSOLIDATED RESPONSIVE REPRESENTATIVES SECTION */}
						<div className="space-y-4">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">
									Authorization & Representatives
								</h2>
								<button
									type="button"
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold uppercase"
								>
									+ Add Rep
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
												className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
												required
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
													className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
													required
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
													className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm"
													required
												/>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest text-sm"
					>
						{loading
							? "Processing Document Storage..."
							: "Save End Of Pipeline Report"}
					</button>
				</div>
			</form>
		</main>
	);
}
