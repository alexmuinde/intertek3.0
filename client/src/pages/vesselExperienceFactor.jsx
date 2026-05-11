import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

/**
 * VesselExperienceFactor Component
 * Features: Automatic Ratio calculation, limit validation (±0.0003),
 * auto-correction for non-qualifying voyages, and full CRUD capability.
 */
export default function VesselExperienceFactor() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();

	const [formData, setFormData] = useState({
		vessel: "",
		port: "",
		date: "",
		voyages: [
			{
				voyageNo: "",
				date: "",
				loadPort: "",
				cargo: "",
				shipFig: "",
				shoreFig: "",
				ratio: "0.00000",
				qual: "y",
			},
		],
		shipTotal: "0.000",
		shoreTotal: "0.000",
		avgRatio: "0.00000",
		upperLimit: "0.00000",
		lowerLimit: "0.00000",
		shipQualTotal: "0.000",
		shoreQualTotal: "0.000",
		vesselExperienceFactor: "0.00000",
		inspectorName: "",
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	// --- DYNAMIC CALCULATIONS & AUTO-CORRECTION LOGIC ---
	useEffect(() => {
		// 1. Calculate Ratios for all rows first
		const updatedVoyages = formData.voyages.map((v) => {
			const ship = parseFloat(v.shipFig) || 0;
			const shore = parseFloat(v.shoreFig) || 0;
			const ratio = shore !== 0 ? (ship / shore).toFixed(5) : "0.00000";
			return { ...v, ratio };
		});

		// 2. Calculate the average and limits based on all current entries
		const shipTotalAll = updatedVoyages.reduce(
			(acc, v) => acc + (parseFloat(v.shipFig) || 0),
			0,
		);
		const shoreTotalAll = updatedVoyages.reduce(
			(acc, v) => acc + (parseFloat(v.shoreFig) || 0),
			0,
		);
		const avgRatioValue =
			shoreTotalAll !== 0 ? shipTotalAll / shoreTotalAll : 0;

		const avgRatio = avgRatioValue.toFixed(5);
		const upperLimit = (avgRatioValue + 0.0003).toFixed(5);
		const lowerLimit = (avgRatioValue - 0.0003).toFixed(5);

		// 3. AUTO-CORRECTION: Update "qual" based on limits
		const autoCorrectedVoyages = updatedVoyages.map((v) => {
			if (v.ratio && v.ratio !== "0.00000") {
				const isOutOfRange =
					parseFloat(v.ratio) > parseFloat(upperLimit) ||
					parseFloat(v.ratio) < parseFloat(lowerLimit);
				// Automatically set to 'n' if out of range, 'y' if within range
				return { ...v, qual: isOutOfRange ? "n" : "y" };
			}
			return v;
		});

		// 4. Calculate final VEF based only on the auto-corrected 'y' voyages
		const qualVoyages = autoCorrectedVoyages.filter(
			(v) => v.qual.toLowerCase() === "y",
		);
		const shipQualTotal = qualVoyages.reduce(
			(acc, v) => acc + (parseFloat(v.shipFig) || 0),
			0,
		);
		const shoreQualTotal = qualVoyages.reduce(
			(acc, v) => acc + (parseFloat(v.shoreFig) || 0),
			0,
		);
		const vef =
			shoreQualTotal !== 0
				? (shipQualTotal / shoreQualTotal).toFixed(5)
				: "0.00000";

		// Deep comparison to prevent infinite update loops
		if (
			JSON.stringify(autoCorrectedVoyages) !==
				JSON.stringify(formData.voyages) ||
			formData.vesselExperienceFactor !== vef
		) {
			setFormData((prev) => ({
				...prev,
				voyages: autoCorrectedVoyages,
				shipTotal: shipTotalAll.toFixed(3),
				shoreTotal: shoreTotalAll.toFixed(3),
				avgRatio,
				upperLimit,
				lowerLimit,
				shipQualTotal: shipQualTotal.toFixed(3),
				shoreQualTotal: shoreQualTotal.toFixed(3),
				vesselExperienceFactor: vef,
			}));
		}
	}, [formData.voyages]);

	// --- INPUT HANDLERS ---
	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.id]: e.target.value });

	const handleVoyageChange = (index, e) => {
		const newVoyages = [...formData.voyages];
		newVoyages[index][e.target.name] = e.target.value;
		setFormData({ ...formData, voyages: newVoyages });
	};

	const addVoyage = () => {
		setFormData({
			...formData,
			voyages: [
				...formData.voyages,
				{
					voyageNo: "",
					date: "",
					loadPort: "",
					cargo: "",
					shipFig: "",
					shoreFig: "",
					ratio: "0.00000",
					qual: "y",
				},
			],
		});
	};

	const removeVoyage = (index) => {
		if (formData.voyages.length > 1) {
			const newVoyages = formData.voyages.filter((_, i) => i !== index);
			setFormData({ ...formData, voyages: newVoyages });
		}
	};

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

	// --- API PERSISTENCE ---
	const handleSave = async () => {
		if (!currentUser) return alert("You must be logged in to save!");
		setLoading(true);
		try {
			const res = await fetch("/api/vesselExperienceFactor/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
					...(id && { _id: id }),
				}),
			});
			const data = await res.json();
			if (data.success !== false)
				alert("Vessel Experience Factor Report Saved!");
		} catch (err) {
			console.error("Save Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif">
			<h1 className="text-xl font-bold text-center mb-6 uppercase border-b-2 border-black pb-2 tracking-widest">
				Vessel Experience Factor
			</h1>

			{/* HEADER SECTION */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border-b border-black bg-gray-50">
				<div>
					<label className="block text-xs font-bold pl-2 text-gray-500 uppercase">
						Vessel
					</label>
					<input
						type="text"
						id="vessel"
						onChange={handleChange}
						className="w-full bg-white border-b border-black p-1 outline-none"
					/>
				</div>
				<div>
					<label className="block text-xs font-bold pl-2 text-gray-500 uppercase">
						Date
					</label>
					<input
						type="date"
						id="date"
						onChange={handleChange}
						className="w-full bg-white border-b border-black p-1 outline-none"
					/>
				</div>
				<div>
					<label className="block text-xs font-bold pl-2 text-gray-500 uppercase">
						Port
					</label>
					<input
						type="text"
						id="port"
						onChange={handleChange}
						className="w-full bg-white border-b border-black p-1 outline-none"
					/>
				</div>
			</div>

			{/* 1. VOYAGE ENTRY SECTION */}
			<div className="mb-4">
				<h2 className="text-sm font-bold bg-black text-white p-1 mb-2">
					1. VOYAGE DATA INPUTS
				</h2>
				{formData.voyages.map((v, index) => (
					<div
						key={index}
						className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-4 p-2 bg-[#f8f6f6] border-b border-black relative"
					>
						<div>
							<label className="text-[10px] pl-1 uppercase">Voy No</label>
							<input
								name="voyageNo"
								value={v.voyageNo}
								onChange={(e) => handleVoyageChange(index, e)}
								className="w-full border-b border-black p-1 bg-transparent outline-none"
							/>
						</div>
						<div>
							<label className="text-[10px] pl-1 uppercase">Date</label>
							<input
								name="date"
								type="date"
								value={v.date}
								onChange={(e) => handleVoyageChange(index, e)}
								className="w-full border-b border-black p-1 bg-transparent outline-none"
							/>
						</div>
						<div>
							<label className="text-[10px] pl-1 uppercase">Load Port</label>
							<input
								name="loadPort"
								value={v.loadPort}
								onChange={(e) => handleVoyageChange(index, e)}
								className="w-full border-b border-black p-1 bg-transparent outline-none"
							/>
						</div>
						<div>
							<label className="text-[10px] pl-1 uppercase">Cargo</label>
							<input
								name="cargo"
								value={v.cargo}
								onChange={(e) => handleVoyageChange(index, e)}
								className="w-full border-b border-black p-1 bg-transparent outline-none"
							/>
						</div>
						<div>
							<label className="text-[10px] pl-1 font-bold text-blue-800">
								SHIP FIGURE
							</label>
							<input
								name="shipFig"
								type="number"
								value={v.shipFig}
								onChange={(e) => handleVoyageChange(index, e)}
								className="w-full border-b border-black p-1 bg-transparent outline-none font-bold"
							/>
						</div>
						<div>
							<label className="text-[10px] pl-1 font-bold text-green-800">
								SHORE FIGURE
							</label>
							<input
								name="shoreFig"
								type="number"
								value={v.shoreFig}
								onChange={(e) => handleVoyageChange(index, e)}
								className="w-full border-b border-black p-1 bg-transparent outline-none font-bold"
							/>
						</div>

						{/* RATIO FIELD WITH DYNAMIC HIGHLIGHTING */}
						<div>
							<label className="text-[10px] pl-1">RATIO</label>
							<input
								name="ratio"
								value={v.ratio}
								readOnly
								className={`w-full border-b border-black p-1 outline-none font-semibold transition-colors duration-300 ${
									v.ratio &&
									v.ratio !== "0.00000" &&
									(parseFloat(v.ratio) > parseFloat(formData.upperLimit) ||
										parseFloat(v.ratio) < parseFloat(formData.lowerLimit))
										? "bg-red-600 text-white"
										: "bg-gray-100 text-black"
								}`}
							/>
						</div>

						<div className="flex items-center">
							<div className="flex-1">
								<label className="text-[10px] pl-1 uppercase">
									Qual? (y/n)
								</label>
								<input
									name="qual"
									value={v.qual}
									onChange={(e) => handleVoyageChange(index, e)}
									className="w-full border-b border-black p-1 bg-transparent outline-none text-center font-bold"
								/>
							</div>
							{index > 0 && (
								<button
									onClick={() => removeVoyage(index)}
									className="text-red-500 font-bold ml-1 hover:scale-125 transition-transform"
								>
									×
								</button>
							)}
						</div>
					</div>
				))}
				<button
					onClick={addVoyage}
					className="w-full p-2 bg-gray-200 hover:bg-gray-300 font-bold text-[10px] uppercase tracking-widest"
				>
					+ Add New Voyage Entry
				</button>
			</div>

			{/* 2. READ-ONLY SUMMARY SECTION */}
			<div className="mb-6">
				<h2 className="text-sm font-bold bg-gray-800 text-white p-1 mb-2 uppercase">
					2. Summary Calculations (Read-Only)
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-black bg-gray-50">
					<div>
						<label className="text-[10px] font-bold text-gray-500 uppercase">
							Ship's Figure Totals
						</label>
						<input
							value={formData.shipTotal}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-gray-500 uppercase">
							Shore Figure Totals
						</label>
						<input
							value={formData.shoreTotal}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-gray-500 uppercase">
							Average Ratio
						</label>
						<input
							value={formData.avgRatio}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-red-500 uppercase">
							Upper Limit (+0.0003)
						</label>
						<input
							value={formData.upperLimit}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold text-red-600"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-red-500 uppercase">
							Lower Limit (-0.0003)
						</label>
						<input
							value={formData.lowerLimit}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold text-red-600"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-blue-600 uppercase">
							Ship's Qualifying Totals
						</label>
						<input
							value={formData.shipQualTotal}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold text-blue-700"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-blue-600 uppercase">
							Shore Qualifying Totals
						</label>
						<input
							value={formData.shoreQualTotal}
							readOnly
							className="w-full border-b border-black p-1 bg-white font-bold text-blue-700"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold uppercase text-black">
							Vessel Experience Factor
						</label>
						<input
							value={formData.vesselExperienceFactor}
							readOnly
							className="w-full border-b-2 border-black p-1 bg-yellow-100 text-lg font-black"
						/>
					</div>
				</div>
			</div>

			{/* FOOTER & SIGNATURES */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 border-t border-black pt-4">
				<div className="text-[11px] leading-relaxed italic pr-4">
					<p className="mb-2 uppercase font-bold not-italic underline">
						Official Qualifying Voyage Rules:
					</p>
					<p>
						1. The last voyage prior to structural modification and the first
						voyage after drydock.
					</p>
					<p>2. Lightering operations.</p>
					<p>3. Voyages where shore measurements are not available.</p>
					<p>4. Voyages outside ±0.3% limits of average vessel ratio.</p>
					<p className="mt-2 font-bold uppercase text-black">
						VEF based on a minimum of five (5) qualifying voyages.
					</p>
					<p className="mt-4 opacity-70 text-[10px]">
						The information shown above is based on data obtained from vessel
						records and we cannot be held responsible for any inaccuracies
						thereof.
					</p>
				</div>

				<div className="space-y-4">
					<div>
						<label className="text-xs font-bold text-gray-500 uppercase">
							Intertek Inspector
						</label>
						<input
							type="text"
							id="inspectorName"
							onChange={handleChange}
							placeholder="Full Name"
							className="w-full bg-[#f8f6f6] border-b border-black p-1 outline-none"
						/>
					</div>
					<div className="flex justify-between items-center border-b border-black pb-1 uppercase font-bold text-xs">
						Representative Signatures
						<button
							onClick={addRep}
							className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded font-bold"
						>
							+ ADD REP
						</button>
					</div>
					{formData.representatives.map((rep, index) => (
						<div
							key={index}
							className="p-3 bg-[#f8f6f6] mb-2 relative border border-gray-200 rounded"
						>
							{index > 0 && (
								<button
									onClick={() => removeRep(index)}
									className="absolute top-1 right-1 text-red-500 font-bold hover:scale-125 transition-transform"
								>
									×
								</button>
							)}
							<input
								name="name"
								placeholder="Full Name"
								value={rep.name}
								onChange={(e) => handleRepChange(index, e)}
								className="w-full border-b border-gray-300 bg-transparent text-xs p-1 mb-2 outline-none font-semibold"
							/>
							<div className="grid grid-cols-2 gap-2">
								<input
									name="id"
									placeholder="ID / Passport"
									value={rep.id}
									onChange={(e) => handleRepChange(index, e)}
									className="border-b border-gray-300 bg-transparent text-xs p-1 outline-none"
								/>
								<input
									name="email"
									placeholder="Email Address"
									value={rep.email}
									onChange={(e) => handleRepChange(index, e)}
									className="border-b border-gray-300 bg-transparent text-xs p-1 outline-none"
								/>
							</div>
						</div>
					))}
					<button
						onClick={handleSave}
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-md"
					>
						{loading ? "Processing..." : "Save Vessel Experience Factor Report"}
					</button>
				</div>
			</div>
		</main>
	);
}
