import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PumpingPressureLog() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		port: "",
		date: "",
		cargo: "",

		// Dynamic array tracking hourly pumping snapshots
		pressureLogs: [
			{
				logDate: "",
				logTime: "",
				manifoldPressure: "",
			},
		],

		// Narrative parameter block values
		minimumRequestedPressure: "",
		maximumRequestedPressure: "",

		intertekInspector: "",
		// Dynamic authorized signers mapped consistently at the base block
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC PRESSURE LOG ROW LOGIC ---
	const handleLogChange = (index, e) => {
		const newLogs = [...formData.pressureLogs];
		newLogs[index][e.target.name] = e.target.value;
		setFormData({ ...formData, pressureLogs: newLogs });
	};

	const addLog = () => {
		setFormData({
			...formData,
			pressureLogs: [
				...formData.pressureLogs,
				{ logDate: "", logTime: "", manifoldPressure: "" },
			],
		});
	};

	const removeLog = (index) => {
		if (formData.pressureLogs.length > 1) {
			const newLogs = formData.pressureLogs.filter((_, i) => i !== index);
			setFormData({ ...formData, pressureLogs: newLogs });
		}
	};

	// --- DYNAMIC REPRESENTATIVE ROW LOGIC ---
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

	// --- DATA STORAGE INTEGRATION LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/pumpingPressureLog/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				// Standard HTML5 safe date converter casting layers
				const formattedData = {
					...data,
					date: data.date
						? new Date(data.date).toISOString().split("T")[0]
						: "",
					pressureLogs: data.pressureLogs?.map((log) => ({
						...log,
						logDate: log.logDate
							? new Date(log.logDate).toISOString().split("T")[0]
							: "",
					})) || [{ logDate: "", logTime: "", manifoldPressure: "" }],
				};

				setFormData(formattedData);
			} catch (error) {
				console.error("Fetch Execution Error Sequence Failed:", error);
			}
		};
		fetchStatus();
	}, [id]);

	const handleSave = async () => {
		if (!currentUser)
			return alert("You must be logged in to save official reports!");
		setLoading(true);
		try {
			const res = await fetch("/api/pumpingPressureLog/save", {
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
				alert("Pumping Pressure Log Record Saved Successfully!");
				if (!id && data._id) {
					navigate(`/pumpingPressureLog/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to commit database tracking profile.");
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
				Pumping Pressure Log
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Core Logistics Data and Pressure Snapshot Loops */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Vessel
							</label>
							<input
								type="text"
								id="vessel"
								onChange={handleChange}
								value={formData.vessel}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Port
							</label>
							<input
								type="text"
								id="port"
								onChange={handleChange}
								value={formData.port}
								className="w-full border-b border-black outline-none p-1"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Date
							</label>
							<input
								type="date"
								id="date"
								onChange={handleChange}
								value={formData.date}
								className="w-full border-b border-black outline-none p-1"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Cargo
							</label>
							<input
								type="text"
								id="cargo"
								onChange={handleChange}
								value={formData.cargo}
								className="w-full border-b border-black outline-none p-1"
								required
							/>
						</div>
					</div>

					{/* DYNAMIC LOG COMPONENT REPEATER CONTAINER */}
					<div className="flex justify-between items-center bg-black text-white p-1 mt-6">
						<h2 className="text-sm font-bold uppercase tracking-wider">
							Hourly Pressure Tracking Snapshot Log
						</h2>
						<button
							type="button"
							onClick={addLog}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Log Row
						</button>
					</div>

					{formData.pressureLogs.map((log, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-2"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeLog(index)}
									className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
								>
									&times;
								</button>
							)}
							<div className="grid grid-cols-3 gap-3 pt-2">
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Log Date
									</label>
									<input
										type="date"
										name="logDate"
										value={log.logDate || ""}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-semibold"
										required
									/>
								</div>
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Log Time
									</label>
									<input
										type="time"
										name="logTime"
										value={log.logTime || ""}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-semibold"
										required
									/>
								</div>
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Manifold Pressure
									</label>
									<input
										type="text"
										name="manifoldPressure"
										placeholder="e.g. 7.5 bar"
										value={log.manifoldPressure || ""}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-0.5 text-xs font-bold text-gray-800"
										required
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* RIGHT COLUMN: Structural Operational Phrases and Authentication Grid */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						{/* Paragraph statement input values */}
						<div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm leading-relaxed border-l-4 border-black">
							Shore requests pressure at ship's manifold to be minimum{" "}
							<input
								type="text"
								id="minimumRequestedPressure"
								onChange={handleChange}
								value={formData.minimumRequestedPressure}
								placeholder="e.g. 6.0 bar"
								className="border-b border-black outline-none bg-transparent w-24 text-center font-bold px-1"
								required
							/>{" "}
							and maximum{" "}
							<input
								type="text"
								id="maximumRequestedPressure"
								onChange={handleChange}
								value={formData.maximumRequestedPressure}
								placeholder="e.g. 10.0 bar"
								className="border-b border-black outline-none bg-transparent w-24 text-center font-bold px-1"
								required
							/>
							.
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

						{/* AUTHORIZATION MATRIX SIGNER BLOCK LOOP */}
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
						onClick={handleSave}
						disabled={loading}
						className="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest"
					>
						{loading
							? "Processing Document Saving..."
							: "Save Pumping Pressure Log"}
					</button>
				</div>
			</div>
		</main>
	);
}
