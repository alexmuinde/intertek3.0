import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function LetterOfProtestSlowRate() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { id } = useParams();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		userReference: currentUser._id,
		recipientName: "",
		vesselName: "",
		portName: "",
		dateOfReport: "",
		cargoDescription: "",
		operationType: "Discharge",

		// Parallel array lists state initialization
		commencedAtTimes: [""],
		commencedAtDates: [""],
		completedAtTimes: [""],
		completedAtDates: [""],
		delayInterruptionTypes: ["Stoppages"],
		operationalRemarks: [""],

		totalOperationTime: "",
		operationQuantity: "",
		calculatedOperationRate: "",

		intertekInspector: "",
		representatives: [
			{
				representativeName: "",
				representativeIdentification: "",
				representativeEmail: "",
			},
		],
	});

	useEffect(() => {
		if (id) {
			const fetchReport = async () => {
				setLoading(true);
				try {
					const res = await fetch(`/api/letterOfProtestSlowRate/get/${id}`);
					const data = await res.json();
					if (data.success !== false) {
						setFormData({
							...data,
							dateOfReport: data.dateOfReport
								? data.dateOfReport.split("T")[0]
								: "",
							commencedAtDates: data.commencedAtDates.map((d) =>
								d ? d.split("T")[0] : "",
							),
							completedAtDates: data.completedAtDates.map((d) =>
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
			const res = await fetch("/api/letterOfProtestSlowRate/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (data.success !== false) {
				alert("Letter of Protest Saved Successfully!");
				if (!id && data._id) {
					navigate(`/letterOfProtestSlowRate/${data._id}`);
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

	// Parallel Arrays Master Utility Append
	const handleAddOperationalRow = () => {
		setFormData({
			...formData,
			commencedAtTimes: [...formData.commencedAtTimes, ""],
			commencedAtDates: [...formData.commencedAtDates, ""],
			completedAtTimes: [...formData.completedAtTimes, ""],
			completedAtDates: [...formData.completedAtDates, ""],
			delayInterruptionTypes: [...formData.delayInterruptionTypes, "Stoppages"],
			operationalRemarks: [...formData.operationalRemarks, ""],
		});
	};

	const handleItemArrayChange = (index, value, field) => {
		const updatedList = [...formData[field]];
		updatedList[index] = value;
		setFormData({ ...formData, [field]: updatedList });
	};

	const handleRemoveOperationalRow = (index) => {
		if (formData.commencedAtTimes.length > 1) {
			setFormData({
				...formData,
				commencedAtTimes: formData.commencedAtTimes.filter(
					(_, i) => i !== index,
				),
				commencedAtDates: formData.commencedAtDates.filter(
					(_, i) => i !== index,
				),
				completedAtTimes: formData.completedAtTimes.filter(
					(_, i) => i !== index,
				),
				completedAtDates: formData.completedAtDates.filter(
					(_, i) => i !== index,
				),
				delayInterruptionTypes: formData.delayInterruptionTypes.filter(
					(_, i) => i !== index,
				),
				operationalRemarks: formData.operationalRemarks.filter(
					(_, i) => i !== index,
				),
			});
		}
	};

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
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:border-black text-xs font-serif font-medium";
	const inlineInputStyle =
		"bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium focus:border focus:border-black transition-all text-xs text-center mx-1 w-24";
	const selectStyle =
		"bg-[#f8f6f6] p-1.5 border-b border-black outline-none font-serif font-medium text-xs rounded mx-1 focus:border-black";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					LETTER OF PROTEST - SLOW RATE
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Split Responsive display */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Headers & Parallel Chronology Entries Block */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Context Headers
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="md:col-span-2">
								<label className={labelStyle}>To</label>
								<input
									onChange={handleChange}
									id="recipientName"
									className={inputStyle}
									type="text"
									placeholder="Recipient Authority / Vessel Master"
									required
									value={formData.recipientName || ""}
								/>
							</div>
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
								<label className={labelStyle}>Date of Report</label>
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
								<label className={labelStyle}>Cargo</label>
								<input
									onChange={handleChange}
									id="cargoDescription"
									className={inputStyle}
									type="text"
									required
									value={formData.cargoDescription || ""}
								/>
							</div>
						</div>

						{/* Inline Appointment Narrative String Panel */}
						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-inner">
							<p className="indent-0">
								We have been appointed as surveyors of the above cargo and have
								to draw your attention to the following:
								<span className="font-bold uppercase tracking-wider text-black ml-1">
									Slow{" "}
								</span>
								<select
									id="operationType"
									className={selectStyle}
									onChange={handleChange}
									value={formData.operationType}
								>
									<option value="Discharge">Discharge</option>
									<option value="Loading">Loading</option>
								</select>
								<span className="font-bold uppercase tracking-wider text-black">
									rate
								</span>
							</p>
						</div>

						{/* Dynamic Track Operational Row Timeline Matrix Logs */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Operational Milestones & Delays Matrix
								</h2>
								<button
									type="button"
									onClick={handleAddOperationalRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-all"
								>
									+ Add Timeline Row
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[450px] overflow-y-auto pr-1">
								{formData.commencedAtTimes.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Timeline Profile Row #{index + 1}
										</span>
										{formData.commencedAtTimes.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveOperationalRow(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete
											</button>
										)}
										<div>
											<label className={labelStyle}>Commenced At</label>
											<input
												value={formData.commencedAtTimes[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"commencedAtTimes",
													)
												}
												className={inputStyle}
												type="time"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Date</label>
											<input
												value={formData.commencedAtDates[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"commencedAtDates",
													)
												}
												className={inputStyle}
												type="date"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Completed At</label>
											<input
												value={formData.completedAtTimes[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"completedAtTimes",
													)
												}
												className={inputStyle}
												type="time"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Date</label>
											<input
												value={formData.completedAtDates[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"completedAtDates",
													)
												}
												className={inputStyle}
												type="date"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Interruption Basis</label>
											<select
												className="w-full bg-[#f8f6f6] p-2 border-b border-black outline-none font-medium text-xs focus:border focus:border-black"
												value={formData.delayInterruptionTypes[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"delayInterruptionTypes",
													)
												}
											>
												<option value="Stoppages">Stoppages</option>
												<option value="Suspensions">Suspensions</option>
											</select>
										</div>
										<div>
											<label className={labelStyle}>Remarks</label>
											<input
												value={formData.operationalRemarks[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"operationalRemarks",
													)
												}
												className={inputStyle}
												type="text"
												placeholder="Delay reason logs"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Inline Calculation Statement, Protest warnings, inspector name, and Grouped Witnesses List */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Operational Rates & Authorization
							</h2>
						</div>

						{/* Narrative Dynamic Summary Parameter Calculations Input Statement Box */}
						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-sm flex flex-col gap-3">
							<p className="indent-0">
								Hence
								<span className="font-bold text-black border-b px-1 mx-1">
									{formData.operationType}
								</span>
								time is
								<input
									onChange={handleChange}
									id="totalOperationTime"
									className={inlineInputStyle}
									type="time"
									required
									value={formData.totalOperationTime || ""}
								/>
							</p>
							<p className="indent-0">
								Quantity
								<span className="font-bold text-black border-b px-1 mx-1">
									{formData.operationType === "Discharge"
										? "Discharged"
										: "Loaded"}
								</span>
								<input
									onChange={handleChange}
									id="operationQuantity"
									className={inlineInputStyle}
									type="text"
									placeholder="e.g. 15,000 MT"
									required
									value={formData.operationQuantity || ""}
								/>
							</p>
							<p className="indent-0">
								<span className="font-bold text-black border-b px-1 mr-1">
									{formData.operationType}
								</span>
								rate
								<input
									onChange={handleChange}
									id="calculatedOperationRate"
									className={inlineInputStyle}
									type="text"
									placeholder="e.g. 450 MT/Hr"
									required
									value={formData.calculatedOperationRate || ""}
								/>
							</p>
						</div>

						<div className="bg-amber-50/60 p-4 border border-amber-200 rounded text-[11px] text-gray-700 leading-relaxed font-serif italic">
							<p className="indent-0">
								Accordingly, we lodge protest in respect to the above and
								reserve all rights of our principals to refer to this matter at
								a later date.
							</p>
						</div>

						<div>
							<label className={labelStyle}>Intertek Inspector Name</label>
							<input
								onChange={handleChange}
								id="intertekInspector"
								className={inputStyle}
								type="text"
								placeholder="Full Operational Inspector Name"
								required
								value={formData.intertekInspector || ""}
							/>
						</div>

						{/* Grouped Dynamic Client Witness List Matrix Container */}
						<div className="border-t border-gray-100 pt-4 space-y-4">
							<div className="flex justify-between items-center bg-gray-50 p-2 border-l-4 border-purple-800">
								<h3 className="text-xs font-bold uppercase tracking-wider font-serif">
									Witness Representatives Verification
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

				{/* Submission Action Anchor */}
				<footer className="mt-4 border-t pt-6 bg-transparent">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Letter of Protest"}
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
