import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function VesselDischargeStatus() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		date: "",
		berthNumber: "",
		shipTanks: "",
		gradeBl: "",
		remarks: "",
		inspectorName: "",
		dischargeLogs: [
			{
				date: "",
				time: "",
				manifoldNo: "",
				pressure: "",
				temp: "",
				rob: "",
				qty: "",
				rate: "",
			},
		],
		representatives: [{ name: "", id: "", email: "" }],
	});

	// Handle standard text inputs
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DISCHARGE LOG LOGIC ---
	const handleLogChange = (index, e) => {
		const newLogs = [...formData.dischargeLogs];
		newLogs[index][e.target.name] = e.target.value;
		setFormData({ ...formData, dischargeLogs: newLogs });
	};

	const addLog = () => {
		setFormData({
			...formData,
			dischargeLogs: [
				...formData.dischargeLogs,
				{
					date: "",
					time: "",
					manifoldNo: "",
					pressure: "",
					temp: "",
					rob: "",
					qty: "",
					rate: "",
				},
			],
		});
	};

	const removeLog = (index) => {
		if (formData.dischargeLogs.length > 1) {
			const newLogs = formData.dischargeLogs.filter((_, i) => i !== index);
			setFormData({ ...formData, dischargeLogs: newLogs });
		}
	};

	// --- REPRESENTATIVE LOGIC ---
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
				const res = await fetch(`/api/vesselDischargeStatus/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				// CRITICAL: Format dates specifically for HTML5 inputs
				const formattedData = {
					...data,
					date: data.date
						? new Date(data.date).toISOString().split("T")[0]
						: "",
					dischargeLogs:
						data.dischargeLogs?.map((log) => ({
							...log,
							date: log.date
								? new Date(log.date).toISOString().split("T")[0]
								: "",
						})) || [],
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
			const res = await fetch("/api/vesselDischargeStatus/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
					...(id && { _id: id }), // If 'id' exists, it updates; otherwise, it creates
				}),
			});
			const data = await res.json();

			if (data.success !== false) {
				alert("Report Saved!");
				// If it was a new record (no current ID in URL), navigate to the edit path
				if (!id && data._id) {
					navigate(`/vesselDischargeStatus/${data._id}`); //
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
				Vessel Discharge Status
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT SECTION: Vessel Info & Logs */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8">
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="col-span-2">
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
								Berth Number
							</label>
							<input
								type="text"
								id="berthNumber"
								value={formData.berthNumber}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Ship Tank(s)
							</label>
							<input
								type="text"
								id="shipTanks"
								value={formData.shipTanks}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Grade/BL
							</label>
							<input
								type="text"
								id="gradeBl"
								value={formData.gradeBl}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
					</div>

					<h2 className="text-sm font-bold bg-black text-white p-1 mb-4 uppercase">
						Discharge Metrics
					</h2>

					{formData.dischargeLogs.map((log, index) => (
						<div
							key={index}
							className="relative p-3 border-b border-gray-100 mb-2"
						>
							{index > 0 && (
								<button
									onClick={() => removeLog(index)}
									className="absolute top-0 right-0 text-red-500 font-bold px-2"
								>
									&times;
								</button>
							)}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Date
									</label>
									<input
										type="date"
										name="date"
										value={log.date}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Time
									</label>
									<input
										type="time"
										name="time"
										value={log.time}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Manifold #
									</label>
									<input
										type="text"
										name="manifoldNo"
										value={log.manifoldNo}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Pressure
									</label>
									<input
										type="text"
										name="pressure"
										value={log.pressure}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Cargo Temp
									</label>
									<input
										type="text"
										name="temp"
										value={log.temp}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										ROB Qty
									</label>
									<input
										type="text"
										name="rob"
										value={log.rob}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Disch Qty
									</label>
									<input
										type="text"
										name="qty"
										value={log.qty}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] uppercase text-gray-400 font-bold">
										Rate
									</label>
									<input
										type="text"
										name="rate"
										value={log.rate}
										onChange={(e) => handleLogChange(index, e)}
										className="w-full text-xs border-b border-gray-200 outline-none"
									/>
								</div>
							</div>
						</div>
					))}

					<button
						onClick={addLog}
						className="mt-4 text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-all font-bold uppercase"
					>
						+ ADD LOG ENTRY
					</button>
				</div>

				{/* RIGHT SECTION: Remarks & Signatures */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between">
					<div className="space-y-6">
						<h2 className="text-sm font-bold border-b border-black uppercase">
							Authorization
						</h2>

						<div>
							<label className="text-xs font-bold text-gray-400 uppercase">
								Remarks
							</label>
							<textarea
								id="remarks"
								value={formData.remarks}
								onChange={handleChange}
								className="w-full border-b border-gray-300 outline-none p-2 text-sm min-h-[100px] focus:bg-gray-50"
							/>
						</div>

						<div>
							<label className="text-xs font-bold text-gray-400 uppercase">
								Intertek Inspector
							</label>
							<input
								type="text"
								id="inspectorName"
								value={formData.inspectorName}
								onChange={handleChange}
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50"
							/>
						</div>

						<div className="space-y-6">
							<div className="flex justify-between items-center border-b border-black pt-4">
								<h2 className="text-sm font-bold uppercase">Representatives</h2>
								<button
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold"
								>
									+ ADD REP
								</button>
							</div>

							{formData.representatives.map((rep, index) => (
								<div
									key={index}
									className="p-3 bg-gray-50 rounded-lg relative border border-gray-100 mb-4"
								>
									{index > 0 && (
										<button
											onClick={() => removeRep(index)}
											className="absolute top-1 right-2 text-red-500 font-bold text-lg"
										>
											&times;
										</button>
									)}
									<div className="space-y-4">
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
						{loading ? "Saving..." : "Save Discharge Status"}
					</button>
				</div>
			</div>
		</main>
	);
}
