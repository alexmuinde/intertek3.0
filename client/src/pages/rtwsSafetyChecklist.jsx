import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RtwsSafetyChecklist() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		intertekInspectorName: "",
		timeOfInspection: "",
		dateOfInspection: "",
		placeOfInspection: "",
		client: "",
		truckNumber: "",
		transporter: "",
		driversName: "",
		previousCargo: "",
		driversId: "",
		toLoad: "",

		// Dynamic Compartment tracking array
		compartments: [{ compartmentNumber: "" }],
		totalCapacity: "0",

		// All 27 Standard Safety Checklist Item States
		checkItem1: false,
		checkItem2: false,
		checkItem3: false,
		checkItem4: false,
		checkItem5: false,
		checkItem6: false,
		checkItem7: false,
		checkItem8: false,
		checkItem9: false,
		checkItem10: false,
		checkItem11: false,
		checkItem12: false,
		checkItem13: false,
		checkItem14: false,
		checkItem15: false,
		checkItem16: false,
		checkItem17: false,
		checkItem18: false,
		checkItem19: false,
		checkItem20: false,
		checkItem21: false,
		checkItem22: false,
		checkItem23: false,
		checkItem24: false,
		checkItem25: false,
		checkItem26: false,
		checkItem27: false,
	});

	const [loading, setLoading] = useState(false);

	// --- AUTO-CALCULATION ENGINE FOR COMPARTMENTS ---
	useEffect(() => {
		let totalCapCalc = 0;
		formData.compartments.forEach((comp) => {
			const value = parseFloat(comp.compartmentNumber) || 0;
			totalCapCalc += value;
		});

		if (formData.totalCapacity !== totalCapCalc.toString()) {
			setFormData((prev) => ({
				...prev,
				totalCapacity: totalCapCalc.toString(),
			}));
		}
	}, [formData.compartments, formData.totalCapacity]);

	const handleChange = (e) => {
		const { id, type, checked, value } = e.target;
		setFormData({
			...formData,
			[id]: type === "checkbox" ? checked : value,
		});
	};

	// --- DYNAMIC COMPARTMENT SECTIONS LOGIC ---
	const handleCompartmentChange = (index, e) => {
		const newCompartments = [...formData.compartments];
		newCompartments[index][e.target.name] = e.target.value;
		setFormData({ ...formData, compartments: newCompartments });
	};

	const addCompartment = () => {
		setFormData({
			...formData,
			compartments: [...formData.compartments, { compartmentNumber: "" }],
		});
	};

	const removeCompartment = (index) => {
		if (formData.compartments.length > 1) {
			const newCompartments = formData.compartments.filter(
				(_, i) => i !== index,
			);
			setFormData({ ...formData, compartments: newCompartments });
		}
	};

	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/rtwsSafetyChecklist/get/${id}`);
				const data = await res.json();

				if (data.success === false) {
					console.error(data.message);
					return;
				}

				const formattedData = {
					...data,
					dateOfInspection: data.dateOfInspection
						? new Date(data.dateOfInspection).toISOString().split("T")[0]
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
			const res = await fetch("/api/rtwsSafetyChecklist/save", {
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
				alert("RTWS Safety Checklist Document Saved Successfully!");
				if (!id && data._id) {
					navigate(`/rtwsSafetyChecklist/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to finalize database tracking.");
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
				RTWS Safety Checklist
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT BLOCK: Logistics and Compartments */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="bg-gray-50 p-3 rounded border border-gray-200 grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<label className="text-xs font-bold uppercase text-gray-500">
								Intertek Inspector
							</label>
							<input
								type="text"
								id="intertekInspectorName"
								onChange={handleChange}
								value={formData.intertekInspectorName}
								placeholder="Inspector Full Name"
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm font-semibold"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Time of Inspection
							</label>
							<input
								type="time"
								id="timeOfInspection"
								onChange={handleChange}
								value={formData.timeOfInspection}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Date of Inspection
							</label>
							<input
								type="date"
								id="dateOfInspection"
								onChange={handleChange}
								value={formData.dateOfInspection}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Place of Inspection
							</label>
							<input
								type="text"
								id="placeOfInspection"
								onChange={handleChange}
								value={formData.placeOfInspection}
								placeholder="Place of Inspection"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Client
							</label>
							<input
								type="text"
								id="client"
								onChange={handleChange}
								value={formData.client}
								placeholder="Client Name"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Truck Number
							</label>
							<input
								type="text"
								id="truckNumber"
								onChange={handleChange}
								value={formData.truckNumber}
								placeholder="Truck Number"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Transporter
							</label>
							<input
								type="text"
								id="transporter"
								onChange={handleChange}
								value={formData.transporter}
								placeholder="Transporter"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Driver's Name
							</label>
							<input
								type="text"
								id="driversName"
								onChange={handleChange}
								value={formData.driversName}
								placeholder="Driver's Name"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Previous Cargo
							</label>
							<input
								type="text"
								id="previousCargo"
								onChange={handleChange}
								value={formData.previousCargo}
								placeholder="Previous Cargo"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Driver's ID
							</label>
							<input
								type="text"
								id="driversId"
								onChange={handleChange}
								value={formData.driversId}
								placeholder="Driver's ID"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								To Load
							</label>
							<input
								type="text"
								id="toLoad"
								onChange={handleChange}
								value={formData.toLoad}
								placeholder="To Load Product"
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
					</div>

					{/* DYNAMIC COMPARTMENT GRID ITERATION BLOCK */}
					<div className="flex justify-between items-center bg-black text-white p-1 mt-6">
						<h2 className="text-sm font-bold uppercase tracking-wider">
							Vehicle Tank Compartments
						</h2>
						<button
							type="button"
							onClick={addCompartment}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Compartment
						</button>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						{formData.compartments.map((comp, index) => (
							<div
								key={index}
								className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-between gap-2"
							>
								<div className="flex-1">
									<label className="text-[9px] font-bold text-gray-400 uppercase block">
										Compartment #{index + 1}
									</label>
									<input
										type="number"
										name="compartmentNumber"
										placeholder="Capacity/ID"
										value={comp.compartmentNumber || ""}
										onChange={(e) => handleCompartmentChange(index, e)}
										className="w-full border-b border-gray-400 bg-transparent outline-none p-0.5 text-xs font-bold"
										required
									/>
								</div>
								{formData.compartments.length > 1 && (
									<button
										type="button"
										onClick={() => removeCompartment(index)}
										className="text-red-500 font-bold hover:text-red-700 text-lg mt-3"
									>
										&times;
									</button>
								)}
							</div>
						))}
					</div>

					{/* READ-ONLY TOTAL CAPACITY SECTION */}
					<div className="p-3 bg-gray-100 border border-gray-300 rounded mt-4">
						<label className="text-xs font-bold uppercase text-gray-700 block mb-1">
							Calculated Total Capacity (Auto-Updating)
						</label>
						<input
							type="text"
							id="totalCapacity"
							value={formData.totalCapacity}
							readOnly
							placeholder="0"
							className="w-full bg-white border border-gray-400 font-extrabold outline-none p-2 text-base text-black cursor-not-allowed rounded shadow-inner"
						/>
					</div>
				</div>

				{/* RIGHT BLOCK: The 27 Auditing Checkboxes and Signatures */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-3">
						<h2 className="text-sm font-bold bg-black text-white p-1 uppercase tracking-wider">
							Safety Checklist Metrics Evaluation
						</h2>

						<div className="max-h-[500px] overflow-y-auto pr-2 border p-2 bg-gray-50 rounded space-y-2 text-xs">
							{[
								"1. Did the truck show any signs of leakage from previous assignment?",
								"2. Is the truck fitted with seat belts both for driver and passenger?",
								"3. Are the seat belts in the truck well maintained?",
								"4. Is the truck fitted with speed governors and original certificate displayed?",
								"5. Is the vehicle fitted with fire extinguisher?",
								"6. Was the vehicle fitted with a spare wheel, jack, wheel spanners and life savers?",
								"7. Was the vehicle fitted with stoppers at the time of inspection?",
								"8. Were vehicle tires free from bulges and no excessive wear?",
								"9. Was risk assessment carried out by our inspector prior to inspection?",
								"10. Were all documents presented by driver or client checked?",
								"11. Did the driver remove dust caps and manifold valves prior to inspection?",
								"12. Were all compartments inspected and found clean, dry and odour free?",
								"13. Were surfaces on top of the RTW, around the manifold found clean, dry and safe?",
								"14. Were the underside of hatches and sealing gaskets on top the RTW inspected?",
								"15. Were PPE used and extreme care taken while entering and exiting compartment?",
								"16. Were internal surfaces inspected and randomly tested with a light colored rag?",
								"17. Were all internal surfaces confirmed to be clean, dry and odor free?",
								"18. Were coaming areas around the man-hole inside the tanker carefully inspected?",
								"19. Was TIC completed, clearly indicating whether it was accepted or rejected?",
								"20. Were reasons for rejection clearly stipulated on the certificate?",
								"21. Was TIC duly filled with relevant information?",
								"22. Was original TIC given to the driver and a copy retained for internal use?",
								"23. Were documents for RTWS loading same products as previous checked to confirm whether or not the previous cargo was exactly the same?",
								"24. Were interior surfaces, manifolds and valves of RTWS loading the same products and previous inspected to confirm no presence of foreign products?",
								"25. Was second opinion sought before pass the tank?",
								"26. Were all dipstick verified against TT marks and were markings on the dipsticks confirmed to the corresponding with the trailer / wagon number during inspection?",
								"27. Were all dipsticks verified against TT marks and were markings on the dipsticks confirmed to be corresponding with the trailer / wagon number before loading at the loading gantry?",
							].map((statement, idx) => {
								const currentKey = `checkItem${idx + 1}`;
								return (
									<label
										key={idx}
										className="flex items-start gap-3 p-1.5 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
									>
										<input
											type="checkbox"
											id={currentKey}
											checked={formData[currentKey] || false}
											onChange={handleChange}
											className="w-4 h-4 mt-0.5 accent-black flex-shrink-0"
										/>
										<span className="leading-tight text-gray-800">
											{statement}
										</span>
									</label>
								);
							})}
						</div>

						<div className="p-2 bg-yellow-50 text-[10px] text-gray-600 border border-yellow-200 font-sans mt-2 rounded">
							<strong>KEY:</strong> TIC : Tank inspection certificate | RTW :
							Road Tank Wagon
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest"
					>
						{loading
							? "Processing Document Storage..."
							: "Save RTWS Safety Checklist"}
					</button>

					<div className="text-[9px] uppercase tracking-wider text-center text-gray-400 font-sans border-t pt-2">
						AUTHOR : QMR | APPROVED BY : GENERAL MANAGER | DOC . REF IMSR , 08 /
						Veg26
					</div>
				</div>
			</form>
		</main>
	);
}
