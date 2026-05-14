import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DischargeProcedureSequence() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		date: "",
		port: "",
		grade: "",
		berth: "",

		// Dynamic expanding array tracking multiple sequential discharge parcel steps
		proceduralSteps: [
			{
				shoreline: "",
				client: "",
				stepGrade: "",
				billOfLading: "",
				shipsTanks: "",
				shoreTanks: "",
				stepRemarks: "",
			},
		],

		// Narrative checklist options
		pressureModifier: "minimum", // minimum or maximum
		manifoldPressureBars: "",

		intertekInspector: "",
		// Dynamic authorized representatives section mirroring Sealing Report layout exactly
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC PROCEDURAL STEPS MATRIX ROW MANIPULATION ---
	const handleStepChange = (index, e) => {
		const newSteps = [...formData.proceduralSteps];
		newSteps[index][e.target.name] = e.target.value;
		setFormData({ ...formData, proceduralSteps: newSteps });
	};

	const addProceduralStep = () => {
		setFormData({
			...formData,
			proceduralSteps: [
				...formData.proceduralSteps,
				{
					shoreline: "",
					client: "",
					stepGrade: "",
					billOfLading: "",
					shipsTanks: "",
					shoreTanks: "",
					stepRemarks: "",
				},
			],
		});
	};

	const removeProceduralStep = (index) => {
		if (formData.proceduralSteps.length > 1) {
			const newSteps = formData.proceduralSteps.filter((_, i) => i !== index);
			setFormData({ ...formData, proceduralSteps: newSteps });
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

	// --- PERSISTENCE RECORD ENGINE DATA LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/dischargeProcedureSequence/get/${id}`);
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
			const res = await fetch("/api/dischargeProcedureSequence/save", {
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
				alert("Discharge Procedure Sequence Saved Successfully!");
				if (!id && data._id) {
					navigate(`/dischargeProcedureSequence/${data._id}`);
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
				Discharge Procedure - Sequence
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT BLOCK: Logistics Information and Procedural Matrix Loops */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<label className="text-xs font-bold uppercase text-gray-500">
								Vessel
							</label>
							<input
								type="text"
								id="vessel"
								onChange={handleChange}
								value={formData.vessel}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm font-bold"
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
								Port
							</label>
							<input
								type="text"
								id="port"
								onChange={handleChange}
								value={formData.port}
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
								className="w-full border-b border-black outline-none p-1 text-sm"
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
								className="w-full border-b border-black outline-none p-1 text-sm"
								required
							/>
						</div>
					</div>

					<p className="text-sm bg-gray-50 p-3 rounded border border-gray-200 leading-relaxed text-gray-700 italic border-l-4 border-black">
						In order to avoid commingling of segregated parcels and facilitate
						smooth discharge, the following procedure/ sequence shall be adhered
						to during the entire discharge operation.
					</p>

					{/* DYNAMIC PROCEDURAL STEPS MATRIX EXPANSION SECTION */}
					<div className="flex justify-between items-center bg-black text-white p-1 mt-6">
						<h2 className="text-sm font-bold uppercase tracking-wider">
							Sequence Logs Matrix
						</h2>
						<button
							type="button"
							onClick={addProceduralStep}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Procedural Step
						</button>
					</div>

					{formData.proceduralSteps.map((step, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-4 space-y-4"
						>
							<div className="flex justify-between items-center border-b pb-1">
								<span className="text-xs font-bold text-gray-700">
									Sequence Item Step #{index + 1}
								</span>
								{formData.proceduralSteps.length > 1 && (
									<button
										type="button"
										onClick={() => removeProceduralStep(index)}
										className="text-red-500 font-bold hover:text-red-700 text-lg"
									>
										&times;
									</button>
								)}
							</div>

							<div className="space-y-4">
								<div>
									<label className="text-[10px] font-bold text-gray-400 uppercase">
										Shoreline
									</label>
									<input
										type="text"
										name="shoreline"
										value={step.shoreline || ""}
										onChange={(e) => handleStepChange(index, e)}
										className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm font-bold text-gray-800"
										required
									/>
								</div>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Client
										</label>
										<input
											type="text"
											name="client"
											value={step.client || ""}
											onChange={(e) => handleStepChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Grade
										</label>
										<input
											type="text"
											name="stepGrade"
											value={step.stepGrade || ""}
											onChange={(e) => handleStepChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											B/Lading
										</label>
										<input
											type="text"
											name="billOfLading"
											value={step.billOfLading || ""}
											onChange={(e) => handleStepChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Ships Tanks
										</label>
										<input
											type="text"
											name="shipsTanks"
											value={step.shipsTanks || ""}
											onChange={(e) => handleStepChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Shore Tanks
										</label>
										<input
											type="text"
											name="shoreTanks"
											value={step.shoreTanks || ""}
											onChange={(e) => handleStepChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div className="col-span-2 md:col-span-1">
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Remarks
										</label>
										<input
											type="text"
											name="stepRemarks"
											value={step.stepRemarks || ""}
											onChange={(e) => handleStepChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* RIGHT BLOCK: Operational Directives and Authorization Signatures */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						{/* Paragraph narrative requirements with dropdown inline integration */}
						<div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm leading-relaxed text-gray-800 space-y-3">
							<div className="font-bold border-b pb-1 uppercase tracking-wider text-xs text-gray-600">
								Standard Operational Remarks
							</div>
							<div className="text-xs list-decimal pl-1 space-y-2">
								<div>
									1. Ship/shore lines must be air-blown in between parcels and
									shoreline must be pigged prior to discharge of next parcel.
								</div>

								<div className="pt-1 leading-loose">
									2. Vessel to maintain{" "}
									<select
										id="pressureModifier"
										value={formData.pressureModifier}
										onChange={handleChange}
										className="border-b border-black bg-white font-bold px-1 text-xs cursor-pointer outline-none"
									>
										<option value="minimum">minimum</option>
										<option value="maximum">maximum</option>
									</select>{" "}
									pressure of{" "}
									<input
										type="text"
										id="manifoldPressureBars"
										value={formData.manifoldPressureBars}
										onChange={handleChange}
										placeholder="e.g. 7.0"
										className="border-b border-black outline-none bg-transparent w-16 text-center font-bold px-1 text-sm"
										required
									/>{" "}
									Bars at ship's manifold.
								</div>

								<div className="pt-1">
									3. Shore to pig line after discharge of each B/lading parcel.
								</div>
							</div>
						</div>

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

						{/* AUTHORIZATION REPRESENTATIVES MATRICES COMPONENT LOOP */}
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
									+ Add Rep
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
							: "Save Discharge Procedure Sequence"}
					</button>
				</div>
			</form>
		</main>
	);
}
