import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SealingReport() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const [formData, setFormData] = useState({
		vessel: "",
		port: "",
		date: "",
		cargo: "",
		seals: [{ location: "", sealNumber: "" }], // Dynamic Sealing Rows
		inspectorName: "",
		representatives: [{ name: "", id: "", email: "" }],
	});
	const [loading, setLoading] = useState(false);

	// General input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- SEAL ROW LOGIC ---
	const handleSealChange = (index, e) => {
		const newSeals = [...formData.seals];
		newSeals[index][e.target.name] = e.target.value;
		setFormData({ ...formData, seals: newSeals });
	};

	const addSeal = () => {
		setFormData({
			...formData,
			seals: [...formData.seals, { location: "", sealNumber: "" }],
		});
	};

	const removeSeal = (index) => {
		if (formData.seals.length > 1) {
			const newSeals = formData.seals.filter((_, i) => i !== index);
			setFormData({ ...formData, seals: newSeals });
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

	// --- SAVE LOGIC ---
	const handleSave = async () => {
		if (!currentUser) return alert("You must be logged in to save!");
		setLoading(true);
		try {
			const res = await fetch("/api/sealingReport/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
					...(id && { _id: id }),
				}),
			});
			const data = await res.json();
			if (data.success !== false) alert("Report Saved!");
		} catch (err) {
			console.error("Save Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif">
			<h1 className="text-2xl font-bold text-center mb-6 uppercase tracking-widest border-b-2 border-black pb-2">
				Sealing Report
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT SECTION: Vessel & Seal Details */}
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
								value={formData.vessel}
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
								value={formData.port}
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
								value={formData.cargo}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1"
							/>
						</div>
					</div>

					<h2 className="text-sm font-bold bg-black text-white p-1 mb-4">
						SEALING DETAILS
					</h2>
					<p className="text-xs italic mb-4">
						We, the undersigned, confirm to have sealed as follows:
					</p>

					{formData.seals.map((seal, index) => (
						<div
							key={index}
							className="grid grid-cols-12 gap-2 mb-4 border-b border-gray-100 pb-2 items-center"
						>
							<div className="col-span-5">
								<label className="text-[10px] uppercase text-gray-400">
									Location/Point
								</label>
								<input
									type="text"
									name="location"
									value={seal.location}
									onChange={(e) => handleSealChange(index, e)}
									placeholder="e.g. Tank 1 Valve"
									className="w-full text-sm border-none outline-none focus:bg-gray-50"
								/>
							</div>
							<div className="col-span-6">
								<label className="text-[10px] uppercase text-gray-400">
									Seal Number
								</label>
								<input
									type="text"
									name="sealNumber"
									value={seal.sealNumber}
									onChange={(e) => handleSealChange(index, e)}
									placeholder="INT 000000"
									className="w-full text-sm border-none outline-none focus:bg-gray-50"
								/>
							</div>
							<div className="col-span-1 text-right pt-4">
								<button
									onClick={() => removeSeal(index)}
									className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
								>
									&times;
								</button>
							</div>
						</div>
					))}

					<button
						onClick={addSeal}
						className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-all font-bold"
					>
						+ ADD SEAL
					</button>
				</div>

				{/* RIGHT SECTION: Signatures / Representatives */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between">
					<div className="space-y-6">
						<h2 className="text-sm font-bold border-b border-black uppercase">
							Authorization
						</h2>

						<div>
							<label className="text-xs font-bold text-gray-400 uppercase">
								Intertek Inspector
							</label>
							<input
								type="text"
								id="inspectorName"
								onChange={handleChange}
								value={formData.inspectorName || ""}
								placeholder="Full Name"
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50 transition-all"
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

							{/* Dynamic Rep Rows - Updated to match SOF exactly */}
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

					{/* Save Button Stays at the bottom */}
					<button
						onClick={handleSave}
						disabled={loading}
						className="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest"
					>
						{loading ? "Saving..." : "Save Sealing Report"}
					</button>
				</div>
			</div>
		</main>
	);
}
