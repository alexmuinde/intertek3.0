import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PipelineInspectionReport() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		cargo: "",
		client: "",
		date: "",

		// Narrative statement fields
		attendanceLocation: "",
		attendanceTime: "",
		attendanceDate: "",
		operationType: "discharge", // discharge or loading

		// Condition fields
		conditionClean: false,
		conditionDry: false,
		conditionOdorFree: false,

		// Technical specifications
		pipelineConstructionMaterial: "Steam",
		reportedPreviousContent: "",
		methodsOfCleaning: "",
		remarks: "",
		intertekInspector: "",

		// Dynamic representatives array matching Sealing Report patterns exactly
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { id, type, checked, value } = e.target;
		setFormData({
			...formData,
			[id]: type === "checkbox" ? checked : value,
		});
	};

	// --- DYNAMIC REPRESENTATIVE BLOCK MANIPULATION (MATCHES SEALING REPORT EXACTLY) ---
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

	// --- DATA RESTORATION LIFECYCLE ENGINE ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/pipelineInspectionReport/get/${id}`);
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
					attendanceDate: data.attendanceDate
						? new Date(data.attendanceDate).toISOString().split("T")[0]
						: "",
				};

				setFormData(formattedData);
			} catch (error) {
				console.error("Fetch Data Error Sequence Failed:", error);
			}
		};
		fetchStatus();
	}, [id]);

	const handleSave = async () => {
		if (!currentUser)
			return alert("You must be logged in to save official reports!");
		setLoading(true);
		try {
			const res = await fetch("/api/pipelineInspectionReport/save", {
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
				alert("Pipeline Inspection Report Saved Successfully!");
				if (!id && data._id) {
					navigate(`/pipelineInspectionReport/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to commit database payload metrics.");
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
				Pipeline Inspection Report - Pigging
			</h1>

			{/* MATCHES THE DUAL-COLUMN RESPONSIVE LAYOUT OF THE SEALING REPORT */}
			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT SECTION: Vessel Info, Paragraph narrative, & Technical specifications */}
				<div className="flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pr-0 lg:pr-8 space-y-6">
					<div className="grid grid-cols-2 gap-4">
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
								Cargo
							</label>
							<input
								type="text"
								id="cargo"
								onChange={handleChange}
								value={formData.cargo}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
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
					</div>

					{/* Embedded Paragraph Statement Block */}
					<p className="p-3 bg-gray-50 rounded border border-gray-200 text-sm leading-relaxed">
						We attended at{" "}
						<input
							type="text"
							id="attendanceLocation"
							placeholder="Location"
							value={formData.attendanceLocation}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center w-36 text-sm"
							required
						/>{" "}
						at{" "}
						<input
							type="time"
							id="attendanceTime"
							value={formData.attendanceTime}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center text-sm"
							required
						/>
						{" , on the "}
						<input
							type="date"
							id="attendanceDate"
							value={formData.attendanceDate}
							onChange={handleChange}
							className="border-b border-black outline-none bg-transparent px-1 font-bold inline-block text-center text-sm"
							required
						/>{" "}
						to visually inspect shoreline for cleanliness before{" "}
						<select
							id="operationType"
							value={formData.operationType}
							onChange={handleChange}
							className="border-b border-black outline-none bg-white font-bold px-1 text-sm cursor-pointer"
						>
							<option value="discharge">discharge</option>
							<option value="loading">loading</option>
						</select>{" "}
						of above named product and report as follows:
					</p>

					{/* Checklist Matrix Area */}
					<div>
						<h2 className="text-sm font-bold bg-black text-white p-1 mb-4 uppercase tracking-wider">
							Condition of Internal Surfaces
						</h2>
						<div className="flex gap-6 p-3 bg-gray-50 rounded border border-gray-200">
							<label className="flex items-center gap-2 text-xs uppercase font-bold cursor-pointer">
								<input
									type="checkbox"
									id="conditionClean"
									checked={formData.conditionClean}
									onChange={handleChange}
									className="w-4 h-4 accent-black"
								/>
								Clean
							</label>
							<label className="flex items-center gap-2 text-xs uppercase font-bold cursor-pointer">
								<input
									type="checkbox"
									id="conditionDry"
									checked={formData.conditionDry}
									onChange={handleChange}
									className="w-4 h-4 accent-black"
								/>
								Dry
							</label>
							<label className="flex items-center gap-2 text-xs uppercase font-bold cursor-pointer">
								<input
									type="checkbox"
									id="conditionOdorFree"
									checked={formData.conditionOdorFree}
									onChange={handleChange}
									className="w-4 h-4 accent-black"
								/>
								Odor Free
							</label>
						</div>
					</div>

					{/* Technical Specifications Area */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Pipeline Construction Material
							</label>
							<select
								id="pipelineConstructionMaterial"
								value={formData.pipelineConstructionMaterial}
								onChange={handleChange}
								className="w-full border-b border-black outline-none p-1.5 bg-white text-sm"
								required
							>
								<option value="Steam">Steam</option>
								<option value="Mild">Mild</option>
								<option value="Coated">Coated</option>
							</select>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Reported Previous Content
							</label>
							<input
								type="text"
								id="reportedPreviousContent"
								onChange={handleChange}
								value={formData.reportedPreviousContent}
								className="w-full border-b border-black outline-none p-1.5 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Methods of Cleaning
							</label>
							<input
								type="text"
								id="methodsOfCleaning"
								onChange={handleChange}
								value={formData.methodsOfCleaning}
								className="w-full border-b border-black outline-none p-1.5 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
					</div>
				</div>

				{/* RIGHT SECTION: Signatures, Authorization & Representative Dynamic Cards */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<div className="p-3 bg-gray-50 border-l-4 border-black font-medium italic text-xs leading-relaxed text-gray-700">
							We certify that in our opinion, according to our visual inspection
							and considering the method of cleaning and previous content by the
							terminal representatives, the above pipeline has been found to be
							in clean condition for conveying the above mentioned product.
						</div>

						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Remarks
							</label>
							<input
								type="text"
								id="remarks"
								onChange={handleChange}
								value={formData.remarks}
								className="w-full border-b border-black outline-none p-2 focus:bg-gray-50 text-sm"
								required
							/>
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

						{/* DYNAMIC REPRESENTATIVES RESPONSIVE PANEL LAYOUT (MATCHES THE STRUCTURE OF THE COPIED SEALS MATRIX) */}
						<div className="space-y-6">
							<div className="flex justify-between items-center border-b border-black">
								<h2 className="text-sm font-bold uppercase">
									Authorization & Representatives
								</h2>
								<button
									type="button"
									onClick={addRep}
									className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold"
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
						onClick={handleSave}
						disabled={loading}
						className="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest text-sm"
					>
						{loading
							? "Processing Document Storage..."
							: "Save Pipeline Inspection Report"}
					</button>
				</div>
			</div>
		</main>
	);
}
