import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function ShipsTanksUllageReport() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { id } = useParams();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		userReference: currentUser._id,
		vesselName: "",
		portName: "",
		dateOfReport: "",
		cargoDescription: "",
		berthNumber: "",

		// Dynamic Parallel Arrays tracking matching tank records columns
		tankNumbers: [""],
		correctedUllageSoundingMetricTons: [""],
		freeWaterDipCentimeters: [""],
		volumesAtTankTemperature: [""],
		temperatures: [""],
		kilogramsPerLitreInAir: [""],
		metricTonsInAir: [""],

		totalVolume: 0, // Read-Only state metrics
		totalWeight: 0, // Read-Only state metrics

		basisKilogramsPerLitreInAir: "",
		basisTemperatureDegrees: "",
		temperatureCoefficientFactorPerDegree: "",

		forwardDraft: "",
		aftDraft: "",
		vesselList: "",
		seaCondition: "",

		equipmentType: "",
		equipmentSerialNumber: "",
		calibrationCertificateNumber: "",
		equipmentExpiryDate: "",

		intertekInspector: "",
		representatives: [
			{
				representativeName: "",
				representativeIdentification: "",
				representativeEmail: "",
			},
		],
	});

	// --- DYNAMIC REAL-TIME GRAND TOTALS MATHEMATICS ENGINE ---
	useEffect(() => {
		const calculatedTotalVolume = formData.volumesAtTankTemperature.reduce(
			(accumulator, currentIndexValue) =>
				accumulator + (parseFloat(currentIndexValue) || 0),
			0,
		);

		const calculatedTotalWeight = formData.metricTonsInAir.reduce(
			(accumulator, currentIndexValue) =>
				accumulator + (parseFloat(currentIndexValue) || 0),
			0,
		);

		setFormData((prevFormData) => ({
			...prevFormData,
			totalVolume: calculatedTotalVolume,
			totalWeight: calculatedTotalWeight,
		}));
	}, [formData.volumesAtTankTemperature, formData.metricTonsInAir]);

	useEffect(() => {
		if (id) {
			const fetchReport = async () => {
				setLoading(true);
				try {
					const res = await fetch(`/api/shipsTanksUllageReport/get/${id}`);
					const data = await res.json();
					if (data.success !== false) {
						setFormData({
							...data,
							dateOfReport: data.dateOfReport
								? data.dateOfReport.split("T")[0]
								: "",
							equipmentExpiryDate: data.equipmentExpiryDate
								? data.equipmentExpiryDate.split("T")[0]
								: "",
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
			const res = await fetch("/api/shipsTanksUllageReport/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (data.success !== false) {
				alert("Record Saved Successfully!");
				if (!id && data._id) {
					navigate(`/shipsTanksUllageReport/${data._id}`);
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

	// Parallel Arrays Column Append Management
	const handleAddTankRecordRow = () => {
		setFormData({
			...formData,
			tankNumbers: [...formData.tankNumbers, ""],
			correctedUllageSoundingMetricTons: [
				...formData.correctedUllageSoundingMetricTons,
				"",
			],
			freeWaterDipCentimeters: [...formData.freeWaterDipCentimeters, ""],
			volumesAtTankTemperature: [...formData.volumesAtTankTemperature, ""],
			temperatures: [...formData.temperatures, ""],
			kilogramsPerLitreInAir: [...formData.kilogramsPerLitreInAir, ""],
			metricTonsInAir: [...formData.metricTonsInAir, ""],
		});
	};

	const handleTankItemChange = (index, value, field) => {
		const updatedList = [...formData[field]];
		updatedList[index] = value;
		setFormData({ ...formData, [field]: updatedList });
	};

	const handleRemoveTankRecordRow = (index) => {
		if (formData.tankNumbers.length > 1) {
			setFormData({
				...formData,
				tankNumbers: formData.tankNumbers.filter((_, i) => i !== index),
				correctedUllageSoundingMetricTons:
					formData.correctedUllageSoundingMetricTons.filter(
						(_, i) => i !== index,
					),
				freeWaterDipCentimeters: formData.freeWaterDipCentimeters.filter(
					(_, i) => i !== index,
				),
				volumesAtTankTemperature: formData.volumesAtTankTemperature.filter(
					(_, i) => i !== index,
				),
				temperatures: formData.temperatures.filter((_, i) => i !== index),
				kilogramsPerLitreInAir: formData.kilogramsPerLitreInAir.filter(
					(_, i) => i !== index,
				),
				metricTonsInAir: formData.metricTonsInAir.filter((_, i) => i !== index),
			});
		}
	};

	// Grouped Representative Array Rows Modifiers
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
	const inlineInputStyle =
		"bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium focus:border focus:border-black transition-all text-xs text-center mx-1 w-20";
	const readOnlyStyle =
		"w-full bg-gray-100 p-2 border-b border-gray-400 outline-none text-xs font-serif font-bold text-blue-800 cursor-not-allowed";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					SHIP'S TANKS ULLAGE REPORT
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Split Responsive Flexible Container layout */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics, Core Dynamic Tanks Lists, and Read-Only Grand Totals Dashboard */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Vessel Identity Profile Headers
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<div className="md:col-span-2">
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
							<div>
								<label className={labelStyle}>Date of Survey</label>
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
								<label className={labelStyle}>Cargo Description</label>
								<input
									onChange={handleChange}
									id="cargoDescription"
									className={inputStyle}
									type="text"
									required
									value={formData.cargoDescription || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Berth Location</label>
								<input
									onChange={handleChange}
									id="berthNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.berthNumber || ""}
								/>
							</div>
						</div>

						{/* Dynamic Tank Metrics Row Block Track Logger */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Volumetric Cargo Gauging Table
								</h2>
								<button
									type="button"
									onClick={handleAddTankRecordRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded hover:bg-gray-800 transition-all uppercase"
								>
									+ Add Tank Row
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-1">
								{formData.tankNumbers.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Tank Card #{index + 1}
										</span>
										{formData.tankNumbers.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveTankRecordRow(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete
											</button>
										)}
										<div className="col-span-2 md:col-span-4">
											<label className={labelStyle}>Tank Number / Code</label>
											<input
												value={formData.tankNumbers[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"tankNumbers",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>
												Corr. Ullage/Sndg (M. Tons)
											</label>
											<input
												value={
													formData.correctedUllageSoundingMetricTons[index]
												}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"correctedUllageSoundingMetricTons",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Free Water Dip (cm)</label>
											<input
												value={formData.freeWaterDipCentimeters[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"freeWaterDipCentimeters",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Volume at Tank Temp</label>
											<input
												value={formData.volumesAtTankTemperature[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"volumesAtTankTemperature",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Temp (°C)</label>
											<input
												value={formData.temperatures[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"temperatures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Kg/Litre in Air</label>
											<input
												value={formData.kilogramsPerLitreInAir[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"kilogramsPerLitreInAir",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Metric Tons in Air</label>
											<input
												value={formData.metricTonsInAir[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"metricTonsInAir",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* MOVED & INTEGRATED REAL-TIME GRAND TOTALS CALCULATIONS SECTION */}
						<div className="bg-gray-100 p-2 border-l-4 border-blue-800 mt-2">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Automated Accumulation Aggregates Dashboard
							</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200 rounded shadow-sm">
							<div>
								<label className={labelStyle}>
									Grand Total Cargo Volume (Auto)
								</label>
								<input
									id="totalVolume"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.totalVolume}
								/>
							</div>
							<div>
								<label className={labelStyle}>
									Grand Total Cargo Weight (Auto)
								</label>
								<input
									id="totalWeight"
									className={readOnlyStyle}
									type="number"
									readOnly
									value={formData.totalWeight}
								/>
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Basis Paragraph, Trim drafts grid, safety tools parameters, and witnesses objects array */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Density Metrics & Trim Displacements
							</h2>
						</div>

						{/* Official Verification Technical Factors Context Box */}
						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-sm">
							<p className="indent-0">
								Kg per litre in air at
								<input
									onChange={handleChange}
									id="basisKilogramsPerLitreInAir"
									className={inlineInputStyle}
									type="number"
									step="any"
									required
									value={formData.basisKilogramsPerLitreInAir || ""}
								/>
								degrees
								<input
									onChange={handleChange}
									id="basisTemperatureDegrees"
									className={inlineInputStyle}
									type="number"
									step="any"
									required
									value={formData.basisTemperatureDegrees || ""}
								/>
								Temperature coefficient factor per degrees
								<input
									onChange={handleChange}
									id="temperatureCoefficientFactorPerDegree"
									className={`${inlineInputStyle} w-24`}
									type="number"
									step="any"
									required
									value={formData.temperatureCoefficientFactorPerDegree || ""}
								/>
							</p>
						</div>

						{/* Trim & Marine Draft Profiles */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/50 p-3 border border-gray-100 rounded">
							<div>
								<label className={labelStyle}>Forward Draft</label>
								<input
									onChange={handleChange}
									id="forwardDraft"
									className={inputStyle}
									type="text"
									required
									value={formData.forwardDraft || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Aft Draft</label>
								<input
									onChange={handleChange}
									id="aftDraft"
									className={inputStyle}
									type="text"
									required
									value={formData.aftDraft || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Vessel List</label>
								<input
									onChange={handleChange}
									id="vesselList"
									className={inputStyle}
									type="text"
									required
									value={formData.vesselList || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Sea Condition</label>
								<input
									onChange={handleChange}
									id="seaCondition"
									className={inputStyle}
									type="text"
									required
									value={formData.seaCondition || ""}
								/>
							</div>
						</div>

						{/* Gauging Equipment Parameters Data */}
						<div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 border border-gray-100 rounded">
							<div className="col-span-2">
								<label className={labelStyle}>Equipment Type</label>
								<input
									onChange={handleChange}
									id="equipmentType"
									className={inputStyle}
									type="text"
									required
									value={formData.equipmentType || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Equipment Serial No.</label>
								<input
									onChange={handleChange}
									id="equipmentSerialNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.equipmentSerialNumber || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Calibration Cert No.</label>
								<input
									onChange={handleChange}
									id="calibrationCertificateNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.calibrationCertificateNumber || ""}
								/>
							</div>
							<div className="col-span-2">
								<label className={labelStyle}>Calibration Expiry Date</label>
								<input
									onChange={handleChange}
									id="equipmentExpiryDate"
									className={inputStyle}
									type="date"
									required
									value={formData.equipmentExpiryDate || ""}
								/>
							</div>
						</div>

						<div className="border-t border-gray-100 pt-2">
							<label className={labelStyle}>
								Intertek Surveyor Signature Name
							</label>
							<input
								onChange={handleChange}
								id="intertekInspector"
								className={inputStyle}
								type="text"
								placeholder="Full Operating Surveyor Name"
								required
								value={formData.intertekInspector || ""}
							/>
						</div>

						{/* Grouped Dynamic Client Witness List Matrix Container */}
						<div className="border-t border-gray-100 pt-4 space-y-4">
							<div className="flex justify-between items-center bg-gray-50 p-2 border-l-4 border-purple-800">
								<h3 className="text-xs font-bold uppercase tracking-wider font-serif">
									Vessel / Terminal Authorization
								</h3>
								<button
									type="button"
									onClick={handleAddRepresentativeRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-all"
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
											Witness Profile #{index + 1}
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
											<label className={labelStyle}>Representative ID</label>
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

				{/* Submission Action Footprint */}
				<footer className="mt-4 border-t pt-6">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Ship's Tanks Ullage Report"}
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
