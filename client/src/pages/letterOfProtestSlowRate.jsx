import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LetterOfProtestSlowRate() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		toAddress: "",
		vessel: "",
		port: "",
		date: "",
		cargo: "",

		// Dropdowns & narrative states
		operationType: "Discharge", // Discharge or Loading
		commencedAtTime: "",
		commencedAtDate: "",
		completedAtTime: "",
		completedAtDate: "",
		delayType: "Stoppages", // Stoppages or Suspensions
		delayRemarks: "",

		totalOperationTime: "",
		totalQuantity: "",
		calculatedRate: "",

		intertekInspector: "",
		// Dynamic authorized signing partners section
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

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

	// --- DATA RESTORATION LIFECYCLE LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/letterOfProtestSlowRate/get/${id}`);
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
					commencedAtDate: data.commencedAtDate
						? new Date(data.commencedAtDate).toISOString().split("T")[0]
						: "",
					completedAtDate: data.completedAtDate
						? new Date(data.completedAtDate).toISOString().split("T")[0]
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
			const res = await fetch("/api/letterOfProtestSlowRate/save", {
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
				alert("Letter of Protest - Slow Rate Saved Successfully!");
				if (!id && data._id) {
					navigate(`/letterOfProtestSlowRate/${data._id}`);
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
				Letter of Protest - Slow Rate
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Core Logistics Data Parameters */}
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
					</div>

					<p className="text-sm bg-gray-50 p-3 rounded border border-gray-200 leading-relaxed">
						We have been appointed as surveyors of the above cargo and have to
						draw your attention to the following :{" "}
						<strong>
							Slow{" "}
							<select
								id="operationType"
								value={formData.operationType}
								onChange={handleChange}
								className="border-b border-black bg-transparent outline-none pb-0.5 font-bold cursor-pointer text-sm"
							>
								<option value="Discharge">Discharge</option>
								<option value="Loading">Loading</option>
							</select>{" "}
							rate
						</strong>
					</p>

					<div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Commenced At (Time)
							</label>
							<input
								type="time"
								id="commencedAtTime"
								onChange={handleChange}
								value={formData.commencedAtTime}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Commenced At (Date)
							</label>
							<input
								type="date"
								id="commencedAtDate"
								onChange={handleChange}
								value={formData.commencedAtDate}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Completed At (Time)
							</label>
							<input
								type="time"
								id="completedAtTime"
								onChange={handleChange}
								value={formData.completedAtTime}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Completed At (Date)
							</label>
							<input
								type="date"
								id="completedAtDate"
								onChange={handleChange}
								value={formData.completedAtDate}
								className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
								required
							/>
						</div>
						<div className="col-span-2 grid grid-cols-3 gap-2 items-end pt-2">
							<div>
								<label className="text-xs font-bold uppercase text-gray-500">
									Log Type
								</label>
								<select
									id="delayType"
									value={formData.delayType}
									onChange={handleChange}
									className="w-full border-b border-black bg-transparent outline-none p-1 cursor-pointer text-sm"
								>
									<option value="Stoppages">Stoppages</option>
									<option value="Suspensions">Suspensions</option>
								</select>
							</div>
							<div className="col-span-2">
								<label className="text-xs font-bold uppercase text-gray-500">
									Remarks
								</label>
								<input
									type="text"
									id="delayRemarks"
									onChange={handleChange}
									value={formData.delayRemarks}
									placeholder="Enter delay details"
									className="w-full border-b border-black bg-transparent outline-none p-1 text-sm"
									required
								/>
							</div>
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: Performance Calculations & Formal Signatures */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm space-y-4">
							<div className="flex items-center gap-2">
								<span>Hence {formData.operationType} time is :</span>
								<input
									type="time"
									id="totalOperationTime"
									onChange={handleChange}
									value={formData.totalOperationTime}
									className="border-b border-black bg-transparent outline-none px-1 font-bold text-sm w-24"
									required
								/>
							</div>
							<div className="flex items-center gap-2">
								<span>
									Quantity{" "}
									{formData.operationType === "Discharge"
										? "Discharged"
										: "Loaded"}{" "}
									:
								</span>
								<input
									type="text"
									id="totalQuantity"
									onChange={handleChange}
									value={formData.totalQuantity}
									placeholder="Metric Tons"
									className="border-b border-black bg-transparent outline-none px-1 font-bold text-sm w-36"
									required
								/>
							</div>
							<div className="flex items-center gap-2">
								<span>{formData.operationType} rate :</span>
								<input
									type="text"
									id="calculatedRate"
									onChange={handleChange}
									value={formData.calculatedRate}
									placeholder="Tons/Hour"
									className="border-b border-black bg-transparent outline-none px-1 font-bold text-sm w-36"
									required
								/>
							</div>
						</div>

						<p className="text-sm italic p-3 bg-gray-50 border-l-4 border-black text-gray-700 leading-relaxed">
							Accordingly, we lodge protest in respect to the above and reserve
							all rights of our principals to refer to this matter at a later
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

						{/* RESPONSIVE SUB-BLOCK COPIED FROM INHERITED SEALS/REPS INTERFACES */}
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
							: "Save Letter of Protest"}
					</button>
				</div>
			</form>
		</main>
	);
}
