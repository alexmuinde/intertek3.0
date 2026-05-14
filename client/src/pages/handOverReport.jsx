import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HandOverReport() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		department: "",
		date: "",
		fromStaff: "",
		toStaff: "",
		staffHandingOver: "",
		staffReceivingHandOver: "",

		// Dynamic expanding array tracking listed hand-over items
		responsibilities: [
			{
				responsibilityText: "",
			},
		],

		departmentHead: "",
		intertekInspector: "",
		// Dynamic authorized representatives panel layout matching Sealing Report patterns exactly
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC RESPONSIBILITIES MATRIX ROW MANIPULATION ---
	const handleResponsibilityChange = (index, e) => {
		const newResponsibilities = [...formData.responsibilities];
		newResponsibilities[index][e.target.name] = e.target.value;
		setFormData({ ...formData, responsibilities: newResponsibilities });
	};

	const addResponsibilityRow = () => {
		setFormData({
			...formData,
			responsibilities: [
				...formData.responsibilities,
				{ responsibilityText: "" },
			],
		});
	};

	const removeResponsibilityRow = (index) => {
		if (formData.responsibilities.length > 1) {
			const newResponsibilities = formData.responsibilities.filter(
				(_, i) => i !== index,
			);
			setFormData({ ...formData, responsibilities: newResponsibilities });
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

	// --- LIFE-CYCLE DEPENDENCY DATA STORAGE LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/handOverReport/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				const formattedData = {
					...data,
					date: data.date
						? new Date(data.date).toISOString().split("T")[0]
						: "",
				};

				setFormData(formattedData);
			} catch (error) {
				console.error("Fetch Data Execution Trace Failed:", error);
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
			const res = await fetch("/api/handOverReport/save", {
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
				alert("Hand Over Report Saved Successfully!");
				if (!id && data._id) {
					navigate(`/handOverReport/${data._id}`);
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
				Hand Over Report
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Main Logistics Parameters */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Department
							</label>
							<input
								type="text"
								id="department"
								onChange={handleChange}
								value={formData.department}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
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
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								From
							</label>
							<input
								type="text"
								id="fromStaff"
								onChange={handleChange}
								value={formData.fromStaff}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								To
							</label>
							<input
								type="text"
								id="toStaff"
								onChange={handleChange}
								value={formData.toStaff}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Staff Handing Over
							</label>
							<input
								type="text"
								id="staffHandingOver"
								onChange={handleChange}
								value={formData.staffHandingOver}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm font-semibold"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Staff Receiving Hand Over
							</label>
							<input
								type="text"
								id="staffReceivingHandOver"
								onChange={handleChange}
								value={formData.staffReceivingHandOver}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm font-semibold"
								required
							/>
						</div>
					</div>

					{/* DYNAMIC RESPONSIBILITIES REPEATER SECTION */}
					<div className="space-y-4">
						<div className="flex justify-between items-center bg-black text-white p-1">
							<h2 className="text-sm font-bold uppercase tracking-wider">
								Responsibilities Transfer Matrix
							</h2>
							<button
								type="button"
								onClick={addResponsibilityRow}
								className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
							>
								+ Add Responsibility Row
							</button>
						</div>

						{formData.responsibilities.map((resp, index) => (
							<div
								key={index}
								className="flex items-end gap-2 bg-gray-50 p-2 rounded border border-gray-200 relative pt-6"
							>
								<span className="absolute top-1 left-2 text-[10px] font-bold text-gray-400">
									Responsibility Item #{index + 1}
								</span>
								{formData.responsibilities.length > 1 && (
									<button
										type="button"
										onClick={() => removeResponsibilityRow(index)}
										className="absolute top-1 right-2 text-red-500 font-bold hover:text-red-700 text-sm"
									>
										&times;
									</button>
								)}
								<div className="flex-1">
									<input
										type="text"
										name="responsibilityText"
										placeholder="Describe targeted responsibility task, key operations, or equipment management transfer details..."
										value={resp.responsibilityText || ""}
										onChange={(e) => handleResponsibilityChange(index, e)}
										className="w-full border-b border-black bg-transparent outline-none p-1 text-sm font-medium"
										required
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* RIGHT COLUMN: System Approvals & Verification Signatures Matrix */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<h2 className="text-sm font-bold border-b border-black uppercase tracking-wider">
							Internal Management Approvals
						</h2>

						<div>
							<label className="text-xs font-bold text-gray-500 uppercase">
								Department Head
							</label>
							<input
								type="text"
								id="departmentHead"
								onChange={handleChange}
								value={formData.departmentHead}
								placeholder="Department Head Name"
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50 text-sm font-bold transition-all"
								required
							/>
						</div>

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

						{/* DYNAMIC REPRESENTATIVES RESPONSIVE PANEL LAYOUT MATCHING SYSTEMS PATTERNS */}
						<div className="space-y-6">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">
									Authorization & Witnesses
								</h2>
								<button
									type="button"
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold uppercase"
								>
									+ ADD Witness
								</button>
							</div>

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
												Witness/Representative Name
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
						className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest text-sm"
					>
						{loading
							? "Processing Document Storage..."
							: "Save Hand Over Report"}
					</button>
				</div>
			</form>
		</main>
	);
}
