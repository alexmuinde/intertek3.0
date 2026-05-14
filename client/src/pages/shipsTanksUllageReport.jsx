import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ShipsTanksUllageReport() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		port: "",
		date: "",
		cargo: "",
		berth: "",
		// Dynamic array tracking all independent tank ullage metrics
		tankLogs: [
			{
				tankNumber: "",
				correctedUllageSoundingMetricTons: "",
				freeWaterDipCentimeters: "",
				volumeAtTankTemperature: "",
				temperature: "",
				kilogramsPerLitreInAir: "",
				metricTonsInAir: "",
			},
		],
		totalVolume: "0.000",
		totalWeight: "0.000",
		// Narrative paragraph metrics
		kilogramsPerLitreInAirAtDegrees: "",
		degreesTemperature: "",
		temperatureCoefficientFactorPerDegrees: "",
		// Positional draft conditions
		fwd: "",
		aft: "",
		list: "",
		seaCondition: "",
		// Dynamic array tracking multiple pieces of testing hardware
		equipmentList: [
			{
				equipmentType: "",
				serialNumber: "",
				calibrationCertificateNumber: "",
				expiryDate: "",
			},
		],
		intertekInspector: "",
		// Dynamic authorized signing partners section
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	// --- AUTO-CALCULATION ENGINE ---
	useEffect(() => {
		let totalVolCalc = 0;
		let totalWeightCalc = 0;

		formData.tankLogs.forEach((log) => {
			const vol = parseFloat(log.volumeAtTankTemperature) || 0;
			const weight = parseFloat(log.metricTonsInAir) || 0;

			totalVolCalc += vol;
			totalWeightCalc += weight;
		});

		if (
			formData.totalVolume !== totalVolCalc.toFixed(3) ||
			formData.totalWeight !== totalWeightCalc.toFixed(3)
		) {
			setFormData((prev) => ({
				...prev,
				totalVolume: totalVolCalc.toFixed(3),
				totalWeight: totalWeightCalc.toFixed(3),
			}));
		}
	}, [formData.tankLogs, formData.totalVolume, formData.totalWeight]);

	// General raw field tracker engine
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC SHIP TANK LOG ROW MANIPULATION ---
	const handleTankLogChange = (index, e) => {
		const newTankLogs = [...formData.tankLogs];
		newTankLogs[index][e.target.name] = e.target.value;
		setFormData({ ...formData, tankLogs: newTankLogs });
	};

	const addTankLog = () => {
		setFormData({
			...formData,
			tankLogs: [
				...formData.tankLogs,
				{
					tankNumber: "",
					correctedUllageSoundingMetricTons: "",
					freeWaterDipCentimeters: "",
					volumeAtTankTemperature: "",
					temperature: "",
					kilogramsPerLitreInAir: "",
					metricTonsInAir: "",
				},
			],
		});
	};

	const removeTankLog = (index) => {
		if (formData.tankLogs.length > 1) {
			const newTankLogs = formData.tankLogs.filter((_, i) => i !== index);
			setFormData({ ...formData, tankLogs: newTankLogs });
		}
	};

	// --- DYNAMIC CALIBRATION EQUIPMENT ROW MANIPULATION ---
	const handleEquipmentChange = (index, e) => {
		const newEquipmentList = [...formData.equipmentList];
		newEquipmentList[index][e.target.name] = e.target.value;
		setFormData({ ...formData, equipmentList: newEquipmentList });
	};

	const addEquipment = () => {
		setFormData({
			...formData,
			equipmentList: [
				...formData.equipmentList,
				{
					equipmentType: "",
					serialNumber: "",
					calibrationCertificateNumber: "",
					expiryDate: "",
				},
			],
		});
	};

	const removeEquipment = (index) => {
		if (formData.equipmentList.length > 1) {
			const newEquipmentList = formData.equipmentList.filter(
				(_, i) => i !== index,
			);
			setFormData({ ...formData, equipmentList: newEquipmentList });
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

	// --- LIFE-CYCLE DEPENDENCY LOADING FOR EDIT SEQUENCES ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/shipsTanksUllageReport/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				// Standard HTML5 compliant input parsing filters
				const formattedData = {
					...data,
					date: data.date
						? new Date(data.date).toISOString().split("T")[0]
						: "",
					equipmentList: data.equipmentList?.map((equip) => ({
						...equip,
						expiryDate: equip.expiryDate
							? new Date(equip.expiryDate).toISOString().split("T")[0]
							: "",
					})) || [
						{
							equipmentType: "",
							serialNumber: "",
							calibrationCertificateNumber: "",
							expiryDate: "",
						},
					],
				};

				setFormData(formattedData);
			} catch (error) {
				console.error("Fetch Error Sequence Failed:", error);
			}
		};
		fetchStatus();
	}, [id]);

	const handleSave = async () => {
		if (!currentUser)
			return alert("You must be logged in to save official reports!");
		setLoading(true);
		try {
			const res = await fetch("/api/shipsTanksUllageReport/save", {
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
				alert("Ship's Tanks Ullage Report Saved Successfully!");
				if (!id && data._id) {
					navigate(`/shipsTanksUllageReport/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to process database entry.");
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
				Ship's Tanks Ullage Report
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT BLOCK - Main Metrics Panel */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8">
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="col-span-2">
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
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Berth
							</label>
							<input
								type="text"
								id="berth"
								onChange={handleChange}
								value={formData.berth}
								className="w-full border-b border-black outline-none p-1"
								required
							/>
						</div>
					</div>

					{/* DYNAMIC LOG COMPONENT CONTAINER */}
					<div className="flex justify-between items-center bg-black text-white p-1 mb-4">
						<h2 className="text-sm font-bold uppercase tracking-wider">
							Tank Ullage Entries Matrix
						</h2>
						<button
							type="button"
							onClick={addTankLog}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Tank Log
						</button>
					</div>

					{formData.tankLogs.map((log, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-4"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeTankLog(index)}
									className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
								>
									&times;
								</button>
							)}

							<div className="space-y-4">
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Tank Number
									</label>
									<input
										type="text"
										name="tankNumber"
										value={log.tankNumber || ""}
										onChange={(e) => handleTankLogChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm font-bold"
										required
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Corr. Ullage/Sndg M. Tons
										</label>
										<input
											type="text"
											name="correctedUllageSoundingMetricTons"
											value={log.correctedUllageSoundingMetricTons || ""}
											onChange={(e) => handleTankLogChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Free Water Dip (Cm)
										</label>
										<input
											type="text"
											name="freeWaterDipCentimeters"
											value={log.freeWaterDipCentimeters || ""}
											onChange={(e) => handleTankLogChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Volume at Tank Temp
										</label>
										<input
											type="text"
											name="volumeAtTankTemperature"
											placeholder="e.g. 1500.50"
											value={log.volumeAtTankTemperature || ""}
											onChange={(e) => handleTankLogChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs font-semibold"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Temp
										</label>
										<input
											type="text"
											name="temperature"
											value={log.temperature || ""}
											onChange={(e) => handleTankLogChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Kg/litre in Air
										</label>
										<input
											type="text"
											name="kilogramsPerLitreInAir"
											value={log.kilogramsPerLitreInAir || ""}
											onChange={(e) => handleTankLogChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Metric Tons in Air
										</label>
										<input
											type="text"
											name="metricTonsInAir"
											placeholder="e.g. 1250.25"
											value={log.metricTonsInAir || ""}
											onChange={(e) => handleTankLogChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs font-semibold"
											required
										/>
									</div>
								</div>
							</div>
						</div>
					))}

					{/* READ-ONLY SUMMARY SECTION */}
					<h2 className="text-sm font-bold bg-gray-200 text-black p-1 mt-6 uppercase tracking-wider">
						Calculated Document Totals (Auto-Updating)
					</h2>
					<div className="grid grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
						<div>
							<label className="text-xs font-bold uppercase text-gray-700">
								Total Volume Sum
							</label>
							<input
								type="text"
								id="totalVolume"
								value={formData.totalVolume}
								readOnly
								placeholder="0.000"
								className="w-full border-b border-gray-400 bg-gray-100 text-black font-extrabold outline-none p-1 cursor-not-allowed text-base"
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-700">
								Total Weight Sum
							</label>
							<input
								type="text"
								id="totalWeight"
								value={formData.totalWeight}
								readOnly
								placeholder="0.000"
								className="w-full border-b border-gray-400 bg-gray-100 text-black font-extrabold outline-none p-1 cursor-not-allowed text-base"
							/>
						</div>
					</div>
				</div>

				{/* RIGHT BLOCK - Declarations, Equipment & Signatures */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between">
					<div className="space-y-6">
						{/* Paragraph Narrative block inputs */}
						<div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm leading-relaxed">
							Kg per litre in air at{" "}
							<input
								type="number"
								id="kilogramsPerLitreInAirAtDegrees"
								onChange={handleChange}
								value={formData.kilogramsPerLitreInAirAtDegrees}
								className="border-b border-black outline-none bg-transparent w-16 text-center font-bold"
							/>{" "}
							degrees{" "}
							<input
								type="number"
								id="degreesTemperature"
								onChange={handleChange}
								value={formData.degreesTemperature}
								className="border-b border-black outline-none bg-transparent w-16 text-center font-bold"
							/>{" "}
							Temperature coefficient factor per degrees{" "}
							<input
								type="number"
								id="temperatureCoefficientFactorPerDegrees"
								onChange={handleChange}
								value={formData.temperatureCoefficientFactorPerDegrees}
								className="border-b border-black outline-none bg-transparent w-24 text-center font-bold"
							/>
						</div>

						{/* Positional Dimensions section */}
						<h2 className="text-sm font-bold bg-black text-white p-1 uppercase tracking-wider">
							Vessel Trim Parameters
						</h2>
						<div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded border border-gray-100">
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									Fwd
								</label>
								<input
									type="text"
									id="fwd"
									onChange={handleChange}
									value={formData.fwd}
									className="w-full border-b border-black outline-none bg-transparent p-1"
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									Aft
								</label>
								<input
									type="text"
									id="aft"
									onChange={handleChange}
									value={formData.aft}
									className="w-full border-b border-black outline-none bg-transparent p-1"
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									List
								</label>
								<input
									type="text"
									id="list"
									onChange={handleChange}
									value={formData.list}
									className="w-full border-b border-black outline-none bg-transparent p-1"
									required
								/>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-gray-400">
									Sea Condition
								</label>
								<input
									type="text"
									id="seaCondition"
									onChange={handleChange}
									value={formData.seaCondition}
									className="w-full border-b border-black outline-none bg-transparent p-1"
									required
								/>
							</div>
						</div>

						{/* DYNAMIC CALIBRATION EQUIPMENT DETAILS SECTION */}
						<div className="flex justify-between items-center bg-black text-white p-1">
							<h2 className="text-sm font-bold uppercase tracking-wider">
								Calibration Equipment Details
							</h2>
							<button
								type="button"
								onClick={addEquipment}
								className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
							>
								+ Add Equipment
							</button>
						</div>

						{formData.equipmentList.map((equipment, index) => (
							<div
								key={index}
								className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-2"
							>
								{index > 0 && (
									<button
										type="button"
										onClick={() => removeEquipment(index)}
										className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
									>
										&times;
									</button>
								)}
								<div className="space-y-3">
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Equipment Type
										</label>
										<input
											type="text"
											name="equipmentType"
											value={equipment.equipmentType || ""}
											onChange={(e) => handleEquipmentChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm font-semibold"
											required
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="text-[10px] font-bold text-gray-400 uppercase">
												S/No.
											</label>
											<input
												type="text"
												name="serialNumber"
												value={equipment.serialNumber || ""}
												onChange={(e) => handleEquipmentChange(index, e)}
												className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
												required
											/>
										</div>
										<div>
											<label className="text-[10px] font-bold text-gray-400 uppercase">
												Calibration Cert. No.
											</label>
											<input
												type="text"
												name="calibrationCertificateNumber"
												value={equipment.calibrationCertificateNumber || ""}
												onChange={(e) => handleEquipmentChange(index, e)}
												className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
												required
											/>
										</div>
										<div className="col-span-2">
											<label className="text-[10px] font-bold text-gray-400 uppercase">
												Expiry Date
											</label>
											<input
												type="date"
												name="expiryDate"
												value={equipment.expiryDate || ""}
												onChange={(e) => handleEquipmentChange(index, e)}
												className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
												required
											/>
										</div>
									</div>
								</div>
							</div>
						))}

						{/* AUTHORIZATION SIGNING MATRIX BLOCK */}
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
								placeholder="Full Name"
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50 transition-all"
								required
							/>
						</div>

						<div className="space-y-4">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">
									Representatives Verification
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
						{loading
							? "Processing Database Entry..."
							: "Save Ships Tanks Ullage Report"}
					</button>
				</div>
			</div>
		</main>
	);
}
