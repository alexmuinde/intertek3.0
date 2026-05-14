import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NoticeOfApparentDiscrepancy() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		toAddress: "",
		vessel: "",
		date: "",
		grade: "",
		port: "",

		// Section 1: Bill of Lading vs Mombasa figures
		billOfLading: "",
		shipsFigureMombasa1: "",
		difference1: "0.000",
		percentageDifference1: "0.00%",

		// Section 2: Load Port vs Mombasa figures
		figuresLoadPort: "",
		shipsFigureMombasa2: "",
		difference2: "0.000",
		percentageDifference2: "0.00%",

		intertekInspector: "",
		// Dynamic representatives panel layout matching Sealing Report patterns exactly
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	// --- MATHEMATICAL AUTO-CALCULATION ENGINE ---
	useEffect(() => {
		// Section 1 Calculations (Bill of Lading vs Ships Figure Mombasa)
		const blVal = parseFloat(formData.billOfLading) || 0;
		const sfMombasa1 = parseFloat(formData.shipsFigureMombasa1) || 0;

		const diff1 = sfMombasa1 - blVal;
		const pct1 = blVal !== 0 ? (diff1 / blVal) * 100 : 0;

		// Section 2 Calculations (Figures at Load Port vs Ships Figure Mombasa)
		const lpVal = parseFloat(formData.figuresLoadPort) || 0;
		const sfMombasa2 = parseFloat(formData.shipsFigureMombasa2) || 0;

		const diff2 = sfMombasa2 - lpVal;
		const pct2 = lpVal !== 0 ? (diff2 / lpVal) * 100 : 0;

		// Safe updates targeted strictly to avoid infinite render loops
		if (
			formData.difference1 !== diff1.toFixed(3) ||
			formData.percentageDifference1 !== pct1.toFixed(2) + "%" ||
			formData.difference2 !== diff2.toFixed(3) ||
			formData.percentageDifference2 !== pct2.toFixed(2) + "%"
		) {
			setFormData((prev) => ({
				...prev,
				difference1: diff1.toFixed(3),
				percentageDifference1: pct1.toFixed(2) + "%",
				difference2: diff2.toFixed(3),
				percentageDifference2: pct2.toFixed(2) + "%",
			}));
		}
	}, [
		formData.billOfLading,
		formData.shipsFigureMombasa1,
		formData.figuresLoadPort,
		formData.shipsFigureMombasa2,
		formData.difference1,
		formData.percentageDifference1,
		formData.difference2,
		formData.percentageDifference2,
	]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
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

	// --- DATA STORAGE INTEGRATION LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/noticeOfApparentDiscrepancy/get/${id}`);
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
				console.error("Fetch Execution Error Sequence Failed:", error);
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
			const res = await fetch("/api/noticeOfApparentDiscrepancy/save", {
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
				alert("Notice of Apparent Discrepancy Saved Successfully!");
				if (!id && data._id) {
					navigate(`/noticeOfApparentDiscrepancy/${data._id}`);
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
				Notice of Apparent Discrepancy
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Core Figures Parameters */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<label className="text-xs font-bold uppercase text-gray-500">
								To
							</label>
							<input
								type="text"
								id="toAddress"
								onChange={handleChange}
								value={formData.toAddress}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
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
								Port
							</label>
							<input
								type="text"
								id="port"
								onChange={handleChange}
								value={formData.port}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
					</div>

					<p className="text-sm bg-gray-50 p-2 border-l-4 border-black italic text-gray-700">
						Acting on behalf of our principals, we hereby notify you the
						following:
					</p>

					{/* SECTION 1 EVALUATION MATRIX GROUP */}
					<div className="space-y-4">
						<h2 className="text-sm font-bold bg-black text-white p-1 uppercase tracking-wider">
							Bill of Lading Comparison Analysis
						</h2>
						<div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-200">
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Bill of Lading Figure
								</label>
								<input
									type="number"
									step="0.001"
									id="billOfLading"
									onChange={handleChange}
									value={formData.billOfLading}
									className="w-full border-b border-black bg-transparent outline-none p-1 font-semibold text-sm"
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Ships Figure at Mombasa
								</label>
								<input
									type="number"
									step="0.001"
									id="shipsFigureMombasa1"
									onChange={handleChange}
									value={formData.shipsFigureMombasa1}
									className="w-full border-b border-black bg-transparent outline-none p-1 font-semibold text-sm"
									required
								/>
							</div>

							{/* Locked Read-Only Outputs */}
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									Difference (Auto)
								</label>
								<input
									type="text"
									id="difference1"
									value={formData.difference1}
									readOnly
									className="w-full border-b border-gray-400 bg-gray-100 text-gray-600 font-bold outline-none p-1 cursor-not-allowed text-sm"
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									% Difference (Auto)
								</label>
								<input
									type="text"
									id="percentageDifference1"
									value={formData.percentageDifference1}
									readOnly
									className="w-full border-b border-gray-400 bg-gray-100 text-gray-600 font-bold outline-none p-1 cursor-not-allowed text-sm"
								/>
							</div>
						</div>
					</div>

					{/* SECTION 2 EVALUATION MATRIX GROUP */}
					<div className="space-y-4">
						<h2 className="text-sm font-bold bg-black text-white p-1 uppercase tracking-wider">
							Load Port Comparison Analysis
						</h2>
						<div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-200">
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Figures at Load Port
								</label>
								<input
									type="number"
									step="0.001"
									id="figuresLoadPort"
									onChange={handleChange}
									value={formData.figuresLoadPort}
									className="w-full border-b border-black bg-transparent outline-none p-1 font-semibold text-sm"
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Ships Figure at Mombasa
								</label>
								<input
									type="number"
									step="0.001"
									id="shipsFigureMombasa2"
									onChange={handleChange}
									value={formData.shipsFigureMombasa2}
									className="w-full border-b border-black bg-transparent outline-none p-1 font-semibold text-sm"
									required
								/>
							</div>

							{/* Locked Read-Only Outputs */}
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									Difference (Auto)
								</label>
								<input
									type="text"
									id="difference2"
									value={formData.difference2}
									readOnly
									className="w-full border-b border-gray-400 bg-gray-100 text-gray-600 font-bold outline-none p-1 cursor-not-allowed text-sm"
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									% Difference (Auto)
								</label>
								<input
									type="text"
									id="percentageDifference2"
									value={formData.percentageDifference2}
									readOnly
									className="w-full border-b border-gray-400 bg-gray-100 text-gray-600 font-bold outline-none p-1 cursor-not-allowed text-sm"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: Formal Protest Terms and Verification Grid */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<p className="text-sm italic p-3 bg-gray-50 border-l-4 border-black text-gray-700 leading-relaxed">
							Accordingly, we lodge protest in respect to this discrepancy and
							reserve all rights of our principals to refer to this at a later
							date.
						</p>

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

						{/* RESPONSIVE PANEL LAYOUT MATCHING COPIED SIGNATURES SECTION */}
						<div className="space-y-6">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">
									Authorization & Representatives
								</h2>
								<button
									type="button"
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold uppercase"
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
							: "Save Notice of Discrepancy"}
					</button>
				</div>
			</form>
		</main>
	);
}
