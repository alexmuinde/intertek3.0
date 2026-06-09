import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function VesselExperienceFactor() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { id } = useParams();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		userReference: currentUser._id,
		vesselName: "",
		dateOfReport: "",
		portName: "",

		voyageNumbers: [""],
		datesOfVoyages: [""],
		loadPorts: [""],
		cargoDescriptions: [""],
		shipsFigures: [""],
		shoreFigures: [""],
		ratiosShipShore: [""],
		isQualifyingVoyages: [""],

		shipsFigureTotals: "",
		shoreFigureTotals: "",
		averageRatio: "",
		upperLimit: "",
		lowerLimit: "",
		shipsQualifyingTotals: "",
		shoreQualifyingTotals: "",
		vesselExperienceFactor: "",

		intertekInspector: "",
		// Grouped state blueprint for adding full single representative items
		representatives: [
			{
				representativeName: "",
				representativeIdentification: "",
				representativeEmail: "",
			},
		],
	});

	// --- DYNAMIC RUNTIME MATHEMATICAL AGGREGATIONS ENGINE ---
	useEffect(() => {
		const updatedRatios = formData.shipsFigures.map((shipVal, index) => {
			const ship = parseFloat(shipVal);
			const shore = parseFloat(formData.shoreFigures[index]);
			if (ship && shore && shore !== 0) {
				return parseFloat((ship / shore).toFixed(4));
			}
			return 0;
		});

		const totalShip = formData.shipsFigures.reduce(
			(acc, curr) => acc + (parseFloat(curr) || 0),
			0,
		);
		const totalShore = formData.shoreFigures.reduce(
			(acc, curr) => acc + (parseFloat(curr) || 0),
			0,
		);

		let avgRatio = 0;
		const validRatios = updatedRatios.filter((val) => val > 0);
		if (validRatios.length > 0) {
			avgRatio = parseFloat(
				(
					validRatios.reduce((acc, curr) => acc + curr, 0) / validRatios.length
				).toFixed(4),
			);
		}

		const upper = avgRatio > 0 ? parseFloat((avgRatio + 0.0003).toFixed(4)) : 0;
		const lower = avgRatio > 0 ? parseFloat((avgRatio - 0.0003).toFixed(4)) : 0;

		let qualifyingShipTotal = 0;
		let qualifyingShoreTotal = 0;

		formData.isQualifyingVoyages.forEach((flag, index) => {
			if (flag && flag.toLowerCase() === "y") {
				qualifyingShipTotal += parseFloat(formData.shipsFigures[index]) || 0;
				qualifyingShoreTotal += parseFloat(formData.shoreFigures[index]) || 0;
			}
		});

		const vefCalculated =
			qualifyingShoreTotal !== 0
				? parseFloat((qualifyingShipTotal / qualifyingShoreTotal).toFixed(4))
				: 0;

		setFormData((prevState) => ({
			...prevState,
			ratiosShipShore: updatedRatios,
			shipsFigureTotals: totalShip,
			shoreFigureTotals: totalShore,
			averageRatio: avgRatio,
			upperLimit: upper,
			lowerLimit: lower,
			shipsQualifyingTotals: qualifyingShipTotal,
			shoreQualifyingTotals: qualifyingShoreTotal,
			vesselExperienceFactor: vefCalculated,
		}));
	}, [
		formData.shipsFigures,
		formData.shoreFigures,
		formData.isQualifyingVoyages,
	]);

	useEffect(() => {
		if (id) {
			const fetchReport = async () => {
				setLoading(true);
				try {
					const res = await fetch(`/api/vesselExperienceFactor/get/${id}`);
					const data = await res.json();
					if (data.success !== false) {
						setFormData({
							...data,
							dateOfReport: data.dateOfReport
								? data.dateOfReport.split("T")[0]
								: "",
							datesOfVoyages: data.datesOfVoyages.map((d) =>
								d ? d.split("T")[0] : "",
							),
						});
					} else {
						setError(data.message);
					}
				} catch (err) {
					setError(true);
				} finally {
					setLoading(false);
				}
			};
			fetchReport();
		}
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(false);
		try {
			const body = id ? { ...formData, _id: id } : formData;
			const res = await fetch("/api/vesselExperienceFactor/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (data.success !== false) {
				alert("Record Saved Successfully!");
				if (!id && data._id) {
					navigate(`/vesselExperienceFactor/${data._id}`);
				}
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError("Failed to establish server communication channels");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
	};

	const handleAddVoyageRecord = () => {
		setFormData({
			...formData,
			voyageNumbers: [...formData.voyageNumbers, ""],
			datesOfVoyages: [...formData.datesOfVoyages, ""],
			loadPorts: [...formData.loadPorts, ""],
			cargoDescriptions: [...formData.cargoDescriptions, ""],
			shipsFigures: [...formData.shipsFigures, ""],
			shoreFigures: [...formData.shoreFigures, ""],
			ratiosShipShore: [...formData.ratiosShipShore, 0],
			isQualifyingVoyages: [...formData.isQualifyingVoyages, ""],
		});
	};

	const handleVoyageItemChange = (index, value, field) => {
		const updatedList = [...formData[field]];
		updatedList[index] = value;
		setFormData({ ...formData, [field]: updatedList });
	};

	const handleRemoveVoyageRecord = (index) => {
		if (formData.voyageNumbers.length > 1) {
			setFormData({
				...formData,
				voyageNumbers: formData.voyageNumbers.filter((_, i) => i !== index),
				datesOfVoyages: formData.datesOfVoyages.filter((_, i) => i !== index),
				loadPorts: formData.loadPorts.filter((_, i) => i !== index),
				cargoDescriptions: formData.cargoDescriptions.filter(
					(_, i) => i !== index,
				),
				shipsFigures: formData.shipsFigures.filter((_, i) => i !== index),
				shoreFigures: formData.shoreFigures.filter((_, i) => i !== index),
				ratiosShipShore: formData.ratiosShipShore.filter((_, i) => i !== index),
				isQualifyingVoyages: formData.isQualifyingVoyages.filter(
					(_, i) => i !== index,
				),
			});
		}
	};

	// Refactored Grouped Object Array Row Modifier Appender
	const handleAddRepresentativeRow = () => {
		setFormData({
			...formData,
			representatives: [
				...formData.representatives,
				{
					representativeName: "",
					representativeIdentification: "",
					representativeEmail: "",
				},
			],
		});
	};

	// Refactored Grouped Object Row Content Value Matrix Changer
	const handleRepresentativeRowChange = (index, field, value) => {
		const updatedRepresentatives = [...formData.representatives];
		updatedRepresentatives[index][field] = value;
		setFormData({ ...formData, representatives: updatedRepresentatives });
	};

	const handleRemoveRepresentativeRow = (index) => {
		if (formData.representatives.length > 1) {
			setFormData({
				...formData,
				representatives: formData.representatives.filter((_, i) => i !== index),
			});
		}
	};

	const inputStyle =
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-xs font-serif font-medium";
	const readOnlyStyle =
		"w-full bg-gray-100 p-2 border-b border-gray-400 outline-none text-xs font-serif font-bold text-blue-800 cursor-not-allowed";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					VESSEL EXPERIENCE FACTOR
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Responsive Side-by-Side Flex Layout */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Logs Matrix + MOVED AUTOMATED CALCULATIONS */}
					<div className="flex-1 flex flex-col gap-6">
						{/* Document Headers */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-gray-100 pb-4">
							<div>
								<label className={labelStyle}>Vessel</label>
								<input
									onChange={handleChange}
									id="vesselName"
									className={inputStyle}
									type="text"
									required
									value={formData.vesselName || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Date</label>
								<input
									onChange={handleChange}
									id="dateOfReport"
									className={inputStyle}
									type="date"
									required
									value={formData.dateOfReport || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Port</label>
								<input
									onChange={handleChange}
									id="portName"
									className={inputStyle}
									type="text"
									required
									value={formData.portName || ""}
								/>
							</div>
						</div>

						{/* Dynamic Interactive Voyage Matrix Row Builder */}
						<div className="flex flex-col gap-4">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-black">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Historical Voyage Data Logger
								</h2>
								<button
									type="button"
									onClick={handleAddVoyageRecord}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded hover:bg-gray-800 transition-all uppercase"
								>
									+ Add Voyage Row
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-1">
								{formData.voyageNumbers.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/50 p-3 border border-gray-200 rounded relative pt-8 group"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
											Row #{index + 1}
										</span>
										{formData.voyageNumbers.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveVoyageRecord(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete Row
											</button>
										)}
										<div>
											<label className={labelStyle}>Voyage Number</label>
											<input
												value={formData.voyageNumbers[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"voyageNumbers",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Date</label>
											<input
												value={formData.datesOfVoyages[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"datesOfVoyages",
													)
												}
												className={inputStyle}
												type="date"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Load Port</label>
											<input
												value={formData.loadPorts[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"loadPorts",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Cargo</label>
											<input
												value={formData.cargoDescriptions[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"cargoDescriptions",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Ship's Figure</label>
											<input
												value={formData.shipsFigures[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"shipsFigures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Shore Figure</label>
											<input
												value={formData.shoreFigures[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"shoreFigures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>
												Ratio Ship/Shore (Auto)
											</label>
											<input
												value={formData.ratiosShipShore[index] || ""}
												className={readOnlyStyle}
												type="number"
												readOnly
											/>
										</div>
										<div>
											<label className={labelStyle}>Qual voy? y/n</label>
											<input
												value={formData.isQualifyingVoyages[index]}
												onChange={(e) =>
													handleVoyageItemChange(
														index,
														e.target.value,
														"isQualifyingVoyages",
													)
												}
												className={inputStyle}
												type="text"
												maxLength={1}
												placeholder="y/n"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* MOVED SECTION: Automated Calculations Container */}
						<div className="bg-gray-100 p-2 border-l-4 border-blue-800 mt-2">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Automated Summary Statistics
							</h2>
						</div>

						<div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200 rounded">
							<div>
								<label className={labelStyle}>Ship's Figure Totals</label>
								<input
									id="shipsFigureTotals"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.shipsFigureTotals || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Shore Figure Totals</label>
								<input
									id="shoreFigureTotals"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.shoreFigureTotals || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Average Ratio</label>
								<input
									id="averageRatio"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.averageRatio || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Upper Limit (+0.0003)</label>
								<input
									id="upperLimit"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.upperLimit || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Lower Limit (-0.0003)</label>
								<input
									id="lowerLimit"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.lowerLimit || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Ship's Qualifying Totals</label>
								<input
									id="shipsQualifyingTotals"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.shipsQualifyingTotals || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Shore Qualifying Totals</label>
								<input
									id="shoreQualifyingTotals"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.shoreQualifyingTotals || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Vessel Experience Factor</label>
								<input
									id="vesselExperienceFactor"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.vesselExperienceFactor || ""}
								/>
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Compliance Legal statements + Refactored Multi Representatives Row Logic */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						{/* Compliance Notices Footnotes */}
						<div className="bg-amber-50/60 p-4 border border-amber-200 rounded text-[11px] text-gray-700 leading-relaxed italic space-y-2">
							<p className="indent-0">
								<strong>Qualifying voyages include:</strong>
								<br />
								1. The last voyage prior to structural modification and the
								first voyage after drydock.
								<br />
								2. Lightering operations.
								<br />
								3. Voyages where shore measurements are not available.
								<br />
								4. Voyages outside +0.3% limits of average vessel ratio.
							</p>
							<p className="indent-0 font-semibold text-black">
								* VEF based on a minimum of five qualifying voyages.
							</p>
							<p className="indent-0 border-t border-amber-200/60 pt-2 text-[10px] text-gray-500">
								The information shown above is based on data obtained from
								vessel records and we cannot be held responsible for any
								inaccuracies thereof.
							</p>
						</div>

						{/* Inspector Identity Field */}
						<div>
							<label className={labelStyle}>Intertek Inspector</label>
							<input
								onChange={handleChange}
								id="intertekInspector"
								className={inputStyle}
								type="text"
								placeholder="Full Inspector Signature"
								required
								value={formData.intertekInspector || ""}
							/>
						</div>

						{/* REFACTORED GROUPED WITNESS SECTION: Single button extends full layout profile matching object models */}
						<div className="border-t border-gray-100 pt-4 space-y-4">
							<div className="flex justify-between items-center bg-gray-50 p-2 border-l-4 border-purple-800">
								<h3 className="text-xs font-bold uppercase tracking-wider font-serif">
									Witness Representatives Sign-Off
								</h3>
								<button
									type="button"
									onClick={handleAddRepresentativeRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-colors"
								>
									+ Add Representative
								</button>
							</div>

							<div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
								{formData.representatives.map((representative, index) => (
									<div
										key={index}
										className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[9px] font-bold bg-purple-800 text-white px-2 py-0.5 rounded">
											Witness #{index + 1}
										</span>
										{formData.representatives.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveRepresentativeRow(index)}
												className="absolute top-1 right-2 text-[9px] text-red-500 border border-red-200 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Remove
											</button>
										)}
										<div>
											<label className={labelStyle}>Representative Name</label>
											<input
												value={representative.representativeName}
												onChange={(e) =>
													handleRepresentativeRowChange(
														index,
														"representativeName",
														e.target.value,
													)
												}
												className={inputStyle}
												placeholder="Witness Full Name"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Representative Id</label>
											<input
												value={representative.representativeIdentification}
												onChange={(e) =>
													handleRepresentativeRowChange(
														index,
														"representativeIdentification",
														e.target.value,
													)
												}
												className={inputStyle}
												placeholder="Passport/ID Number"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Representative Email</label>
											<input
												value={representative.representativeEmail}
												type="email"
												onChange={(e) =>
													handleRepresentativeRowChange(
														index,
														"representativeEmail",
														e.target.value,
													)
												}
												className={inputStyle}
												placeholder="active@email.com"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Submission Action Anchor Footprint */}
				<footer className="mt-4 border-t pt-6">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Vessel Experience Factor Report"}
					</button>
					{error && (
						<p className="text-red-600 text-center mt-4 text-xs font-bold uppercase tracking-wider font-serif">
							{error}
						</p>
					)}
				</footer>
			</form>
		</main>
	);
}
