import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LetterOfProtestGeneral() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		date: "",
		berthNumber: "",
		shipTanks: "",
		gradeBillOfLading: "",

		// Dynamic expanding array tracking multiple sequential protest remarks
		remarksEntries: [
			{
				remarkText: "",
			},
		],

		intertekInspector: "",
		// Dynamic representatives array placed strictly at the base of the layout
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC REMARKS LOGIC ---
	const handleRemarkChange = (index, e) => {
		const newRemarksEntries = [...formData.remarksEntries];
		newRemarksEntries[index][e.target.name] = e.target.value;
		setFormData({ ...formData, remarksEntries: newRemarksEntries });
	};

	const addRemarkRow = () => {
		setFormData({
			...formData,
			remarksEntries: [...formData.remarksEntries, { remarkText: "" }],
		});
	};

	const removeRemarkRow = (index) => {
		if (formData.remarksEntries.length > 1) {
			const newRemarksEntries = formData.remarksEntries.filter(
				(_, i) => i !== index,
			);
			setFormData({ ...formData, remarksEntries: newRemarksEntries });
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

	// --- DATA RESTORATION LIFECYCLE ENGINE ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/letterOfProtestGeneral/get/${id}`);
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
			const res = await fetch("/api/letterOfProtestGeneral/save", {
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
				alert("Letter of Protest - General Record Saved Successfully!");
				if (!id && data._id) {
					navigate(`/letterOfProtestGeneral/${data._id}`);
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
				Letter of Protest - General
			</h1>

			<form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
				{/* LEFT COLUMN: Logistics Metadata and Dynamic Remarks Logs */}
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
								Berth Number
							</label>
							<input
								type="text"
								id="berthNumber"
								onChange={handleChange}
								value={formData.berthNumber}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Ship Tank(s)
							</label>
							<input
								type="text"
								id="shipTanks"
								onChange={handleChange}
								value={formData.shipTanks}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-bold uppercase text-gray-500">
								Grade / Bill Of Lading
							</label>
							<input
								type="text"
								id="gradeBillOfLading"
								onChange={handleChange}
								value={formData.gradeBillOfLading}
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50 text-sm"
								required
							/>
						</div>
					</div>

					<p className="text-sm bg-gray-50 p-2 border-l-4 border-black italic text-gray-700">
						Acting for and on behalf of our principals, we hereby notify you of
						the following:
					</p>

					{/* DYNAMIC REMARK ROW INTERFACE */}
					<div className="space-y-4">
						<div className="flex justify-between items-center bg-black text-white p-1">
							<h2 className="text-sm font-bold uppercase tracking-wider">
								Protest Notification Remarks
							</h2>
							<button
								type="button"
								onClick={addRemarkRow}
								className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
							>
								+ Add Remark Row
							</button>
						</div>

						{formData.remarksEntries.map((entry, index) => (
							<div
								key={index}
								className="flex items-end gap-2 bg-gray-50 p-2 rounded border border-gray-200 relative pt-6"
							>
								<span className="absolute top-1 left-2 text-[10px] font-bold text-gray-400">
									Statement Reference #{index + 1}
								</span>
								{formData.remarksEntries.length > 1 && (
									<button
										type="button"
										onClick={() => removeRemarkRow(index)}
										className="absolute top-1 right-2 text-red-500 font-bold hover:text-red-700 text-sm"
									>
										&times;
									</button>
								)}
								<div className="flex-1">
									<input
										type="text"
										name="remarkText"
										placeholder="Type standard or general discrepancy observation details..."
										value={entry.remarkText || ""}
										onChange={(e) => handleRemarkChange(index, e)}
										className="w-full border-b border-black bg-transparent outline-none p-1 text-sm font-medium"
										required
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* RIGHT COLUMN: Formal Protest Protection Phrases and Authorization Cards */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
						<p className="text-sm italic p-3 bg-gray-50 border-l-4 border-black text-gray-700 leading-relaxed">
							Accordingly, we lodge protest in respect of the above and reserve
							all rights of our principals to refer to this matter on a later
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

						{/* RESPONSIVE PANEL LAYOUT MATCHING COPIED SIGNATURES SECTION */}
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
							: "Save General Protest Letter"}
					</button>
				</div>
			</form>
		</main>
	);
}
