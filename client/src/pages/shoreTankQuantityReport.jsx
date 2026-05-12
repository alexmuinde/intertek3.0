import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ShoreTankQuantityReport() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		vessel: "",
		date: "",
		port: "",
		installation: "",
		product: "",
		operation: "",
		// Dynamic Measurement Rows
		measurements: [
			{
				overallDipMm: "",
				productDipMm: "",
				tankTemp: "",
				density: "",
				observedVolLtrs: "",
				weightMTonsAir: "",
			},
		],
		densityAt: "30",
		coefficientFactor: "",
		dippingTapeSerial: "",
		dippingTapeCert: "",
		dippingTapeExpiry: "",
		thermometerSerial: "",
		thermometerCert: "",
		thermometerExpiry: "",
		remarks: "",
		inspectorName: "",
		representatives: [{ name: "", id: "", email: "" }],
	});

	useEffect(() => {
		if (id) {
			const fetchData = async () => {
				const res = await fetch(`/api/shoreTankQuantityReport/get/${id}`);
				const data = await res.json();
				if (data.success !== false) {
					setFormData({
						...data,
						date: data.date ? data.date.split("T")[0] : "",
						dippingTapeExpiry: data.dippingTapeExpiry
							? data.dippingTapeExpiry.split("T")[0]
							: "",
						thermometerExpiry: data.thermometerExpiry
							? data.thermometerExpiry.split("T")[0]
							: "",
					});
				}
			};
			fetchData();
		}
	}, [id]);

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.id]: e.target.value });

	// --- DYNAMIC MEASUREMENT LOGIC ---
	const handleMeasureChange = (index, e) => {
		const newMeasures = [...formData.measurements];
		newMeasures[index][e.target.name] = e.target.value;
		setFormData({ ...formData, measurements: newMeasures });
	};
	const addMeasure = () =>
		setFormData({
			...formData,
			measurements: [
				...formData.measurements,
				{
					overallDipMm: "",
					productDipMm: "",
					tankTemp: "",
					density: "",
					observedVolLtrs: "",
					weightMTonsAir: "",
				},
			],
		});
	const removeMeasure = (index) => {
		if (formData.measurements.length > 1) {
			setFormData({
				...formData,
				measurements: formData.measurements.filter((_, i) => i !== index),
			});
		}
	};

	// --- DYNAMIC REPRESENTATIVE LOGIC ---
	const handleRepChange = (index, e) => {
		const newReps = [...formData.representatives];
		newReps[index][e.target.name] = e.target.value;
		setFormData({ ...formData, representatives: newReps });
	};
	const addRep = () =>
		setFormData({
			...formData,
			representatives: [
				...formData.representatives,
				{ name: "", id: "", email: "" },
			],
		});
	const removeRep = (index) => {
		if (formData.representatives.length > 1) {
			setFormData({
				...formData,
				representatives: formData.representatives.filter((_, i) => i !== index),
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// 1. Clean the data: remove empty date strings so Mongoose doesn't crash
		const cleanedData = { ...formData };
		if (!cleanedData.date) delete cleanedData.date;
		if (!cleanedData.dippingTapeExpiry) delete cleanedData.dippingTapeExpiry;
		if (!cleanedData.thermometerExpiry) delete cleanedData.thermometerExpiry;

		const body = id
			? { ...cleanedData, _id: id }
			: { ...cleanedData, userRef: currentUser._id };

		try {
			const res = await fetch("/api/shoreTankQuantityReport/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();

			if (data.success !== false) {
				alert("Report Saved!");
				if (!id) navigate(`/shoreTankQuantityReport/${data._id}`);
			} else {
				// This will now show the specific Mongoose validation error
				alert("Save Failed: " + data.message);
			}
		} catch (err) {
			console.error("Submit Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif text-gray-800">
			<h1 className="text-2xl font-bold text-center mb-6 uppercase tracking-widest border-b-2 border-black pb-2">
				Shore Tank Quantity Report
			</h1>

			<form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT: Operation & Measurements */}
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
					</div>

					<div className="flex justify-between items-center bg-black text-white p-1 mb-4">
						<h2 className="text-sm font-bold uppercase tracking-tighter">
							Measurement Data
						</h2>
						<button
							type="button"
							onClick={addMeasure}
							className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-bold hover:bg-gray-200"
						>
							+ ADD TANK
						</button>
					</div>

					{formData.measurements.map((m, index) => (
						<div
							key={index}
							className="relative p-3 border-b border-gray-100 mb-4 group bg-gray-50/50"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeMeasure(index)}
									className="absolute top-0 right-0 text-red-500 font-bold px-2"
								>
									&times;
								</button>
							)}
							<div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
								{Object.keys(m).map((key) => (
									<div key={key}>
										<label className="text-[9px] font-bold text-gray-400 uppercase">
											{key.replace(/([A-Z])/g, " $1")}
										</label>
										<input
											type="text"
											name={key}
											value={m[key]}
											onChange={(e) => handleMeasureChange(index, e)}
											className="w-full border-b border-gray-300 outline-none p-0.5 text-xs bg-transparent"
										/>
									</div>
								))}
							</div>
						</div>
					))}

					<div className="bg-gray-100 p-3 rounded mb-6 text-sm">
						Density at{" "}
						<select
							id="densityAt"
							onChange={handleChange}
							value={formData.densityAt}
							className="border-b border-black bg-transparent mx-1"
						>
							<option value="30">30</option>
							<option value="50">50</option>
						</select>
						Coeff Factor:{" "}
						<input
							type="text"
							id="coefficientFactor"
							onChange={handleChange}
							value={formData.coefficientFactor}
							className="border-b border-black bg-transparent w-20 outline-none px-1"
						/>
					</div>

					<h2 className="text-sm font-bold border-b border-black mb-4 uppercase">
						Equipment Calibration
					</h2>
					<div className="grid grid-cols-3 gap-4 text-[11px] mb-8">
						<div className="col-span-3 font-bold text-gray-500 border-b border-gray-100 uppercase text-[9px]">
							Dipping Tape
						</div>
						<input
							type="text"
							id="dippingTapeSerial"
							placeholder="Serial"
							onChange={handleChange}
							value={formData.dippingTapeSerial}
							className="border-b border-gray-300 outline-none"
						/>
						<input
							type="text"
							id="dippingTapeCert"
							placeholder="Cert No"
							onChange={handleChange}
							value={formData.dippingTapeCert}
							className="border-b border-gray-300 outline-none"
						/>
						<input
							type="date"
							id="dippingTapeExpiry"
							onChange={handleChange}
							value={formData.dippingTapeExpiry}
							className="border-b border-gray-300 outline-none"
						/>

						<div className="col-span-3 font-bold text-gray-500 border-b border-gray-100 uppercase text-[9px] mt-2">
							Thermometer
						</div>
						<input
							type="text"
							id="thermometerSerial"
							placeholder="Serial"
							onChange={handleChange}
							value={formData.thermometerSerial}
							className="border-b border-gray-300 outline-none"
						/>
						<input
							type="text"
							id="thermometerCert"
							placeholder="Cert No"
							onChange={handleChange}
							value={formData.thermometerCert}
							className="border-b border-gray-300 outline-none"
						/>
						<input
							type="date"
							id="thermometerExpiry"
							onChange={handleChange}
							value={formData.thermometerExpiry}
							className="border-b border-gray-300 outline-none"
						/>
					</div>
				</div>

				{/* RIGHT: Remarks, Inspector & Reps */}
				<div className="flex-1 lg:pl-8 space-y-6">
					<h2 className="text-sm font-bold border-b border-black uppercase tracking-tighter">
						Authorization
					</h2>

					<div>
						<label className="text-xs font-bold text-gray-400 uppercase">
							Remarks / Observations
						</label>
						<textarea
							id="remarks"
							onChange={handleChange}
							value={formData.remarks}
							className="w-full border-b border-gray-300 outline-none p-1 text-sm min-h-[80px] focus:bg-gray-50"
							placeholder="Enter any additional notes..."
						/>
					</div>

					<div>
						<label className="text-xs font-bold text-gray-400 uppercase">
							Intertek Inspector
						</label>
						<input
							type="text"
							id="inspectorName"
							onChange={handleChange}
							value={formData.inspectorName}
							className="w-full border-b border-gray-300 outline-none p-1 focus:bg-gray-50"
						/>
					</div>

					<div className="flex justify-between items-center border-b border-black pt-4">
						<h2 className="text-sm font-bold uppercase">Representatives</h2>
						<button
							type="button"
							onClick={addRep}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold hover:bg-blue-700"
						>
							+ ADD REP
						</button>
					</div>

					{formData.representatives.map((rep, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded relative border border-gray-100"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeRep(index)}
									className="absolute top-1 right-2 text-red-500 font-bold"
								>
									&times;
								</button>
							)}
							<div className="space-y-3">
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Name
									</label>
									<input
										type="text"
										name="name"
										onChange={(e) => handleRepChange(index, e)}
										value={rep.name}
										className="w-full border-b border-gray-300 bg-transparent outline-none text-sm"
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
											onChange={(e) => handleRepChange(index, e)}
											value={rep.id}
											className="w-full border-b border-gray-300 bg-transparent outline-none text-xs"
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Email
										</label>
										<input
											type="email"
											name="email"
											onChange={(e) => handleRepChange(index, e)}
											value={rep.email}
											className="w-full border-b border-gray-300 bg-transparent outline-none text-xs"
										/>
									</div>
								</div>
							</div>
						</div>
					))}

					<button
						disabled={loading}
						className="w-full bg-black text-white py-3 rounded font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-all"
					>
						{loading
							? "Saving..."
							: id
								? "Update Record"
								: "Save Shore Tank Report"}
					</button>
				</div>
			</form>
		</main>
	);
}
