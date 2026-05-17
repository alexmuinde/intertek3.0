import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function PipelineInspectionReport() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { id } = useParams();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		userReference: currentUser._id,
		vesselName: "",
		cargoDescription: "",
		clientName: "",
		dateOfReport: "",

		attendanceLocation: "",
		timeOfAttendance: "",
		dateOfAttendance: "",
		operationType: "discharge",

		isInternalSurfaceClean: false,
		isInternalSurfaceDry: false,
		isInternalSurfaceOdorFree: false,

		pipelineConstructionMaterial: "Steam",
		reportedPreviousContent: "",
		methodsOfCleaning: "",

		measurementRemarks: "",
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
					const res = await fetch(`/api/pipelineInspectionReport/get/${id}`);
					const data = await res.json();
					if (data.success !== false) {
						setFormData({
							...data,
							dateOfReport: data.dateOfReport
								? data.dateOfReport.split("T")[0]
								: "",
							dateOfAttendance: data.dateOfAttendance
								? data.dateOfAttendance.split("T")[0]
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
			const res = await fetch("/api/pipelineInspectionReport/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (data.success !== false) {
				alert("Pipeline Inspection Report Saved Successfully!");
				if (!id && data._id) {
					navigate(`/pipelineInspectionReport/${data._id}`);
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
		const { id, value, type, checked } = e.target;
		setFormData({
			...formData,
			[id]: type === "checkbox" ? checked : value,
		});
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
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-xs font-serif font-medium";
	const inlineInputStyle =
		"bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium focus:border focus:border-black transition-all text-xs text-center mx-1 w-36";
	const selectStyle =
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none text-xs font-serif font-medium focus:border focus:border-black transition-all";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";
	const checkboxStyle = "w-4 h-4 cursor-pointer accent-black";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			{/* Removed headerDiv element matrix track directly from here */}

			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					PIPELINE INSPECTION REPORT - PIGGING
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Framing & Inline Narrative Statement */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Context Headers
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
							<div>
								<label className={labelStyle}>Client</label>
								<input
									onChange={handleChange}
									id="clientName"
									className={inputStyle}
									type="text"
									required
									value={formData.clientName || ""}
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
						</div>

						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-inner">
							<p className="indent-0">
								We attended at
								<input
									onChange={handleChange}
									id="attendanceLocation"
									className={inlineInputStyle}
									type="text"
									placeholder="Terminal / Terminal Facility"
									required
									value={formData.attendanceLocation || ""}
								/>
								at
								<input
									onChange={handleChange}
									id="timeOfAttendance"
									className={`${inlineInputStyle} w-24`}
									type="time"
									required
									value={formData.timeOfAttendance || ""}
								/>
								, on the
								<input
									onChange={handleChange}
									id="dateOfAttendance"
									className={`${inlineInputStyle} w-32`}
									type="date"
									required
									value={formData.dateOfAttendance || ""}
								/>
								to visually inspect shoreline for cleanliness before
								<select
									id="operationType"
									className="bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium text-xs rounded mx-1"
									onChange={handleChange}
									value={formData.operationType}
								>
									<option value="discharge">discharge</option>
									<option value="loading">loading</option>
								</select>
								of above named product and report as follows:
							</p>
						</div>

						<div className="bg-gray-50 border border-gray-200 rounded p-4 flex flex-col gap-3">
							<span className="text-[10px] font-bold text-gray-400 font-serif uppercase tracking-wider border-b pb-1">
								Condition of Internal Surfaces
							</span>
							<div className="flex flex-wrap gap-8 items-center pl-1">
								<div className="flex items-center gap-2.5">
									<input
										onChange={handleChange}
										type="checkbox"
										id="isInternalSurfaceClean"
										className={checkboxStyle}
										checked={formData.isInternalSurfaceClean}
									/>
									<label
										htmlFor="isInternalSurfaceClean"
										className="text-xs cursor-pointer font-bold uppercase tracking-wide"
									>
										Clean
									</label>
								</div>
								<div className="flex items-center gap-2.5">
									<input
										onChange={handleChange}
										type="checkbox"
										id="isInternalSurfaceDry"
										className={checkboxStyle}
										checked={formData.isInternalSurfaceDry}
									/>
									<label
										htmlFor="isInternalSurfaceDry"
										className="text-xs cursor-pointer font-bold uppercase tracking-wide"
									>
										Dry
									</label>
								</div>
								<div className="flex items-center gap-2.5">
									<input
										onChange={handleChange}
										type="checkbox"
										id="isInternalSurfaceOdorFree"
										className={checkboxStyle}
										checked={formData.isInternalSurfaceOdorFree}
									/>
									<label
										htmlFor="isInternalSurfaceOdorFree"
										className="text-xs cursor-pointer font-bold uppercase tracking-wide"
									>
										Odor Free
									</label>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
							<div>
								<label className={labelStyle}>
									Pipeline Construction Material
								</label>
								<select
									id="pipelineConstructionMaterial"
									className={selectStyle}
									onChange={handleChange}
									value={formData.pipelineConstructionMaterial}
								>
									<option value="Steam">Steam</option>
									<option value="Mild">Mild</option>
									<option value="Coated">Coated</option>
								</select>
							</div>
							<div>
								<label className={labelStyle}>Reported Previous Content</label>
								<input
									onChange={handleChange}
									id="reportedPreviousContent"
									className={inputStyle}
									type="text"
									required
									value={formData.reportedPreviousContent || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Methods of Cleaning</label>
								<input
									onChange={handleChange}
									id="methodsOfCleaning"
									className={inputStyle}
									type="text"
									required
									value={formData.methodsOfCleaning || ""}
								/>
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Legals, Observations Remarks, Inspector Name, and Grouped Witnesses */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Certifications & Observations
							</h2>
						</div>

						<div className="bg-amber-50/60 p-4 border border-amber-200 rounded text-[11px] text-gray-700 leading-relaxed font-serif italic space-y-3">
							<p className="indent-0">
								We certify that in our opinion, according to our visual
								inspection and considering the method of cleaning and previous
								content by the terminal representatives, the above pipeline has
								been found to be in clean condition for conveying the above
								mentioned product.
							</p>
						</div>

						<div>
							<label className={labelStyle}>Remarks</label>
							<input
								onChange={handleChange}
								id="measurementRemarks"
								className={inputStyle}
								type="text"
								required
								value={formData.measurementRemarks || ""}
							/>
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

						<div className="border-t border-gray-100 pt-4 space-y-4">
							<div className="flex justify-between items-center bg-gray-50 p-2 border-l-4 border-purple-800">
								<h3 className="text-xs font-bold uppercase tracking-wider font-serif">
									Terminal Witness Sign-Off
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

				<footer className="mt-4 border-t pt-6 bg-transparent">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Pipeline Inspection Report"}
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
