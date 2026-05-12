import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function StatementOfFacts() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		vessel: "",
		port: "",
		date: "",
		cargo: "",
		entries: [{ date: "", time: "", remarks: "" }], // Array for dynamic facts
		inspectorName: "",
		representatives: [{ name: "", id: "", email: "" }],
	});
	const [loading, setLoading] = useState(false);

	// Handle simple input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// Handle dynamic entry changes
	const handleEntryChange = (index, e) => {
		const newEntries = [...formData.entries];
		newEntries[index][e.target.name] = e.target.value;
		setFormData({ ...formData, entries: newEntries });
	};

	const addEntry = () => {
		setFormData({
			...formData,
			entries: [...formData.entries, { date: "", time: "", remarks: "" }],
		});
	};

	// Function to remove a specific event row
	const removeEntry = (index) => {
		// Only allow deletion if there is more than one row
		if (formData.entries.length > 1) {
			const newEntries = formData.entries.filter((_, i) => i !== index);
			setFormData({ ...formData, entries: newEntries });
		} else {
			alert("At least one event entry is required.");
		}
	};

	// Handler for representative input changes
	const handleRepChange = (index, e) => {
		const newReps = [...formData.representatives];
		newReps[index][e.target.name] = e.target.value;
		setFormData({ ...formData, representatives: newReps });
	};

	// Add a new blank representative row
	const addRep = () => {
		setFormData({
			...formData,
			representatives: [
				...formData.representatives,
				{ name: "", id: "", email: "" },
			],
		});
	};

	// Remove a specific representative row
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
				const res = await fetch(`/api/statementOfFacts/get/${id}`);
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
			const res = await fetch("/api/statementOfFacts/save", {
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
				alert("Record Saved!");
				// If it was a new record (no current ID in URL), navigate to the edit path
				if (!id && data._id) {
					navigate(`/statementOfFacts/${data._id}`); //
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
				Statement of Facts
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT SECTION: Vessel Info & Facts */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8">
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Vessel
							</label>
							<input
								type="text"
								id="vessel"
								onChange={handleChange}
								value={formData.vessel || ""}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
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
								value={formData.port || ""}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Date
							</label>
							<input
								type="date"
								id="date"
								value={formData.date ? formData.date.split("T")[0] : ""}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Cargo
							</label>
							<input
								type="text"
								id="cargo"
								value={formData.cargo || ""}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
					</div>

					<h2 className="text-sm font-bold bg-black text-white p-1 mb-4">
						LOG OF EVENTS
					</h2>

					{formData.entries.map((entry, index) => (
						<div
							key={index}
							className="grid grid-cols-12 gap-2 mb-4 border-b border-gray-100 pb-2 items-center"
						>
							{/* Date Input */}
							<div className="col-span-3">
								<input
									type="date"
									name="date"
									value={entry.date}
									onChange={(e) => handleEntryChange(index, e)}
									className="w-full text-sm border-none outline-none focus:bg-gray-50"
								/>
							</div>

							{/* Time Input */}
							<div className="col-span-2">
								<input
									type="time"
									name="time"
									value={entry.time}
									onChange={(e) => handleEntryChange(index, e)}
									className="w-full text-sm border-none outline-none focus:bg-gray-50"
								/>
							</div>

							{/* Remarks Input */}
							<div className="col-span-6">
								<input
									type="text"
									name="remarks"
									placeholder="Remarks/Facts..."
									value={entry.remarks}
									onChange={(e) => handleEntryChange(index, e)}
									className="w-full text-sm border-none outline-none focus:bg-gray-50"
								/>
							</div>

							{/* Delete Row Button */}
							<div className="col-span-1 text-right">
								<button
									onClick={() => removeEntry(index)}
									className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
									title="Remove Entry"
								>
									&times;
								</button>
							</div>
						</div>
					))}

					<button
						onClick={addEntry}
						className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-all font-bold"
					>
						+ ADD ROW
					</button>
				</div>

				{/* RIGHT SECTION: Signatures / Representatives */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between">
					<div className="space-y-6">
						<h2 className="text-sm font-bold border-b border-black">
							AUTHORIZATION
						</h2>
						<div>
							<label className="text-xs font-bold text-gray-400">
								INTERTEK INSPECTOR
							</label>
							<input
								type="text"
								id="inspectorName"
								onChange={handleChange}
								value={formData.inspectorName || ""}
								placeholder="Full Name"
								className="w-full border-b border-gray-300 outline-none p-2"
							/>
						</div>
						<div className="space-y-6">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">
									Authorization & Representatives
								</h2>
								<button
									type="button"
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold"
								>
									+ ADD REP
								</button>
							</div>

							{/* Dynamic Rep Rows */}
							{formData.representatives.map((rep, index) => (
								<div
									key={index}
									className="p-3 bg-gray-50 rounded-lg relative border border-gray-100 mb-4"
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
						className="mt-10 w-full bg-black text-white py-3 font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-all"
					>
						{loading ? "Saving..." : "Save Statement of Facts"}
					</button>
				</div>
			</div>
		</main>
	);
}
