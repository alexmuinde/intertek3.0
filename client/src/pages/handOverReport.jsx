import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function HandOverReport() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { id } = useParams();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		userReference: currentUser._id,
		departmentName: "",
		dateOfReport: "",
		outgoingStaffName: "",
		incomingStaffName: "",
		staffHandingOverSignature: "",
		staffReceivingHandOverSignature: "",

		// Parallel array tracking states initialization for dynamic lines
		assignedResponsibilities: [""],

		departmentHeadName: "",
	});

	useEffect(() => {
		if (id) {
			const fetchReport = async () => {
				setLoading(true);
				try {
					const res = await fetch(`/api/handOverReport/get/${id}`);
					const data = await res.json();
					if (data.success !== false) {
						setFormData({
							...data,
							dateOfReport: data.dateOfReport
								? data.dateOfReport.split("T")[0]
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
			const res = await fetch("/api/handOverReport/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (data.success !== false) {
				alert("Hand Over Report Saved Successfully!");
				if (!id && data._id) {
					navigate(`/handOverReport/${data._id}`);
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

	// Dynamic primitive text row appender management utility
	const handleAddResponsibilityRow = () => {
		setFormData({
			...formData,
			assignedResponsibilities: [...formData.assignedResponsibilities, ""],
		});
	};

	const handleResponsibilityItemChange = (index, value) => {
		const updatedList = [...formData.assignedResponsibilities];
		updatedList[index] = value;
		setFormData({ ...formData, assignedResponsibilities: updatedList });
	};

	const handleRemoveResponsibilityRow = (index) => {
		if (formData.assignedResponsibilities.length > 1) {
			setFormData({
				...formData,
				assignedResponsibilities: formData.assignedResponsibilities.filter(
					(_, i) => i !== index,
				),
			});
		}
	};

	const inputStyle =
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:border-black text-xs font-serif font-medium";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					HAND OVER REPORT
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Flex Split Structure Component Layout */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Department Identity Profiles & Active Handover Operators Context */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Context Headers
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={labelStyle}>Department</label>
								<input
									onChange={handleChange}
									id="departmentName"
									className={inputStyle}
									type="text"
									placeholder="Operational Department Branch"
									required
									value={formData.departmentName || ""}
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
								<label className={labelStyle}>From (Outgoing Name)</label>
								<input
									onChange={handleChange}
									id="outgoingStaffName"
									className={inputStyle}
									type="text"
									placeholder="Full Name of Handing Over Staff"
									required
									value={formData.outgoingStaffName || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>To (Incoming Name)</label>
								<input
									onChange={handleChange}
									id="incomingStaffName"
									className={inputStyle}
									type="text"
									placeholder="Full Name of Receiving Staff"
									required
									value={formData.incomingStaffName || ""}
								/>
							</div>
						</div>

						<div className="bg-gray-100 p-2 border-l-4 border-blue-800 mt-2">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Shift Turnover Attestations
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-100 rounded">
							<div>
								<label className={labelStyle}>
									Staff Handing Over Signature
								</label>
								<input
									onChange={handleChange}
									id="staffHandingOverSignature"
									className={inputStyle}
									type="text"
									placeholder="Outgoing Staff Signature Name"
									required
									value={formData.staffHandingOverSignature || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>
									Staff Receiving Hand Over Signature
								</label>
								<input
									onChange={handleChange}
									id="staffReceivingHandOverSignature"
									className={inputStyle}
									type="text"
									placeholder="Incoming Staff Signature Name"
									required
									value={formData.staffReceivingHandOverSignature || ""}
								/>
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Dynamic Tasks/Responsibilities rows matrix logger & Authorization End-Signatures */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-purple-800">
							<h2 className="text-xs font-bold uppercase tracking-wider font-serif">
								Assigned Operational Responsibilities
							</h2>
							<button
								type="button"
								onClick={handleAddResponsibilityRow}
								className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-colors"
							>
								+ Add Duty / Task
							</button>
						</div>

						{/* Dynamic Track Operational Row Logger Table */}
						<div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
							{formData.assignedResponsibilities.map(
								(responsibility, index) => (
									<div
										key={index}
										className="flex gap-2 bg-gray-50/60 p-2 border border-gray-200 rounded relative pt-7 items-end"
									>
										<span className="absolute top-1 left-2 text-[9px] font-bold bg-purple-800 text-white px-2 py-0.5 rounded">
											Task Record #{index + 1}
										</span>
										{formData.assignedResponsibilities.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveResponsibilityRow(index)}
												className="absolute top-0.5 right-1.5 text-[10px] border border-red-200 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Remove
											</button>
										)}
										<div className="w-full">
											<input
												value={responsibility}
												onChange={(e) =>
													handleResponsibilityItemChange(index, e.target.value)
												}
												className={inputStyle}
												type="text"
												placeholder="Stipulate detailed responsibility parameters or inventory status notes"
												required
											/>
										</div>
									</div>
								),
							)}
						</div>

						<div className="bg-gray-100 p-2 border-l-4 border-black mt-2">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Management Verification Sign-Off
							</h2>
						</div>

						<div>
							<label className={labelStyle}>Department Head Name</label>
							<input
								onChange={handleChange}
								id="departmentHeadName"
								className={inputStyle}
								type="text"
								placeholder="Full Authorizing Branch Manager Name"
								required
								value={formData.departmentHeadName || ""}
							/>
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
							? "Processing Shift Document Data..."
							: "Submit Official Hand Over Report"}
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
