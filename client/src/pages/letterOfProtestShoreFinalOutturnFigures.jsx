import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LetterOfProtestShoreFinalOutturnFigures() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		toAddress: "",
		vessel: "",
		date: "",
		grade: "",
		port: "",

		// Narrative text conditional parameter
		shoreProvisionalProtestDate: "",

		// Mathematical comparison fields
		billOfLadingFigure: "",
		shoreFinalOutturnFigure: "",
		difference: "0.000",
		percentageDifference: "0.00%",

		intertekInspector: "",
		// Dynamic representatives panel layout matching Sealing Report patterns exactly
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	// --- AUTOMATED MATHEMATICAL ENGINE ---
	useEffect(() => {
		const blVal = parseFloat(formData.billOfLadingFigure) || 0;
		const shoreOutturnVal = parseFloat(formData.shoreFinalOutturnFigure) || 0;

		const diff = shoreOutturnVal - blVal;
		const pct = blVal !== 0 ? (diff / blVal) * 100 : 0;

		// Safe status assignment guards to prevent frame rendering infinite loop crashes
		if (
			formData.difference !== diff.toFixed(3) ||
			formData.percentageDifference !== pct.toFixed(2) + "%"
		) {
			setFormData((prev) => ({
				...prev,
				difference: diff.toFixed(3),
				percentageDifference: pct.toFixed(2) + "%",
			}));
		}
	}, [
		formData.billOfLadingFigure,
		formData.shoreFinalOutturnFigure,
		formData.difference,
		formData.percentageDifference,
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

	// --- LIFE-CYCLE DEPENDENCY DATA STORAGE LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(
					`/api/letterOfProtestShoreFinalOutturnFigures/get/${id}`,
				);
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
					shoreProvisionalProtestDate: data.shoreProvisionalProtestDate
						? new Date(data.shoreProvisionalProtestDate)
								.toISOString()
								.split("T")[0]
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
			const res = await fetch(
				"/api/letterOfProtestShoreFinalOutturnFigures/save",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...formData,
						userRef: currentUser._id,
						...(id && { _id: id }),
					}),
				},
			);
			const data = await res.json();

			if (data.success !== false) {
				alert("Protest of Final Outturn Figures Saved Successfully!");
				if (!id && data._id) {
					navigate(`/letterOfProtestShoreFinalOutturnFigures/${data._id}`);
				}
			} else {
				alert(
					data.message ||
						"Failed to commit database payload track configuration.",
				);
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
				Letter of Protest - Shore Final Outturn Figures
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Main Figures Parameters */}
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

					{/* Paragraph Statement with Embedded Conditional Inputs */}
					<div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm leading-relaxed border-l-4 border-black">
						Further to our letter of protest on shore provisional outturn
						figures dated{" "}
						<input
							type="date"
							id="shoreProvisionalProtestDate"
							value={formData.shoreProvisionalProtestDate}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center text-xs"
							required
						/>{" "}
						on the subject matter, please be informed that we have finalized
						shore outturn and noted the following weight discrepancy:
					</div>

					{/* CORE CALCULATION GRID */}
					<div className="space-y-4">
						<h2 className="text-sm font-bold bg-black text-white p-1 uppercase tracking-wider">
							Outturn Comparison Quantification
						</h2>
						<div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Bill of Lading Figure
								</label>
								<input
									type="number"
									step="0.001"
									id="billOfLadingFigure"
									onChange={handleChange}
									value={formData.billOfLadingFigure}
									className="w-full border-b border-black bg-transparent outline-none p-1 font-semibold text-sm"
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Shore Final Outturn Figure
								</label>
								<input
									type="number"
									step="0.001"
									id="shoreFinalOutturnFigure"
									onChange={handleChange}
									value={formData.shoreFinalOutturnFigure}
									className="w-full border-b border-black bg-transparent outline-none p-1 font-semibold text-sm"
									required
								/>
							</div>

							{/* Auto-Calculated Read Only Section Inputs */}
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									Difference (Auto)
								</label>
								<input
									type="text"
									id="difference"
									value={formData.difference}
									readOnly
									className="w-full border-b border-gray-400 bg-gray-100 text-gray-600 font-extrabold outline-none p-1 cursor-not-allowed text-sm"
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									% Difference (Auto)
								</label>
								<input
									type="text"
									id="percentageDifference"
									value={formData.percentageDifference}
									readOnly
									className="w-full border-b border-gray-400 bg-gray-100 text-gray-600 font-extrabold outline-none p-1 cursor-not-allowed text-sm"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: Protest Form Statements & Authorization signatures */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<p className="text-sm italic p-3 bg-gray-50 border-l-4 border-black text-gray-700 leading-relaxed">
							Accordingly we are compelled to lodge protest/Notice of claim in
							respect to the above and reserve all rights of our principals/
							whom it may concern to refer to you this matter at a later date.
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

						{/* DYNAMIC REPRESENTATIVES RESPONSIVE MATRIX LOOP (MATCHES THE COPIED SEALS CODE DESIGN) */}
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
							: "Save Final Outturn Protest"}
					</button>
				</div>
			</form>
		</main>
	);
}
