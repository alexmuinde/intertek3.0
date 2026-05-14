import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ReceiptOfSealedSamples() {
	const { currentUser } = useSelector((state) => state.user);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		vessel: "",
		client: "",
		portOfLoading: "",
		date: "",
		cargo: "",

		// Dynamic expanding array tracking listed samples
		samples: [
			{
				grade: "",
				sizeOfSamples: "",
				sealNumber: "",
				description: "",
			},
		],

		intertekInspector: "",
		// Dynamic authorized representatives placed strictly at the end of the document
		representatives: [{ name: "", id: "", email: "" }],
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// --- DYNAMIC SAMPLE MATRIX ROW MANIPULATION ---
	const handleSampleChange = (index, e) => {
		const newSamples = [...formData.samples];
		newSamples[index][e.target.name] = e.target.value;
		setFormData({ ...formData, samples: newSamples });
	};

	const addSampleRow = () => {
		setFormData({
			...formData,
			samples: [
				...formData.samples,
				{ grade: "", sizeOfSamples: "", sealNumber: "", description: "" },
			],
		});
	};

	const removeSampleRow = (index) => {
		if (formData.samples.length > 1) {
			const newSamples = formData.samples.filter((_, i) => i !== index);
			setFormData({ ...formData, samples: newSamples });
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

	// --- LIFE-CYCLE ACCELERATOR DATA LOADER ---
	useEffect(() => {
		const fetchStatus = async () => {
			if (!id) return;
			try {
				const res = await fetch(`/api/receiptOfSealedSamples/get/${id}`);
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
				console.error("Fetch Data Sequence Failure:", error);
			}
		};
		fetchStatus();
	}, [id]);

	const handleSave = async () => {
		if (!currentUser)
			return alert("You must be logged in to save official reports!");
		setLoading(true);
		try {
			const res = await fetch("/api/receiptOfSealedSamples/save", {
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
				alert("Receipt of Sealed Samples Saved Successfully!");
				if (!id && data._id) {
					navigate(`/receiptOfSealedSamples/${data._id}`);
				}
			} else {
				alert(data.message || "Failed to commit database payload execution.");
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
				Receipt of Sealed Samples
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* LEFT BLOCK: Logistics General Information */}
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
								className="w-full border-b border-black outline-none p-1 focus:bg-gray-50"
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
						<div className="col-span-2">
							<label className="text-xs font-bold uppercase text-gray-500">
								Port of Loading
							</label>
							<input
								type="text"
								id="portOfLoading"
								onChange={handleChange}
								value={formData.portOfLoading}
								className="w-full border-b border-black outline-none p-1"
								required
							/>
						</div>
						<div className="col-span-2">
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
					</div>

					{/* DYNAMIC ITEM LOG MATRIX EXPANSION SECTION */}
					<div className="flex justify-between items-center bg-black text-white p-1 mt-6">
						<h2 className="text-sm font-bold uppercase tracking-wider">
							Acknowledge Receipt of Listed Samples
						</h2>
						<button
							type="button"
							onClick={addSampleRow}
							className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 font-bold uppercase"
						>
							+ Add Sample Row
						</button>
					</div>

					{formData.samples.map((sample, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded-lg relative border border-gray-200 mb-4"
						>
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeSampleRow(index)}
									className="absolute top-1 right-2 text-red-500 font-bold text-lg hover:text-red-700"
								>
									&times;
								</button>
							)}

							<div className="space-y-4">
								<div className="grid grid-cols-3 gap-3">
									<div className="col-span-3">
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Grade
										</label>
										<input
											type="text"
											name="grade"
											value={sample.grade || ""}
											onChange={(e) => handleSampleChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-sm font-bold"
											required
										/>
									</div>
									<div>
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Size of Samples
										</label>
										<input
											type="text"
											name="sizeOfSamples"
											value={sample.sizeOfSamples || ""}
											onChange={(e) => handleSampleChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div className="col-span-2">
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Seal No.
										</label>
										<input
											type="text"
											name="sealNumber"
											value={sample.sealNumber || ""}
											onChange={(e) => handleSampleChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
									<div className="col-span-3">
										<label className="text-[10px] font-bold text-gray-400 uppercase">
											Description
										</label>
										<input
											type="text"
											name="description"
											value={sample.description || ""}
											onChange={(e) => handleSampleChange(index, e)}
											className="w-full border-b border-gray-300 bg-transparent outline-none p-1 text-xs"
											required
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* RIGHT BLOCK: Authorization Witnesses Signatures Loop */}
				<div className="flex-1 lg:pl-8 flex flex-col justify-between space-y-6">
					<div className="space-y-6">
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
								className="w-full border-b border-gray-300 outline-none p-2 focus:bg-gray-50 transition-all text-sm font-bold"
								required
							/>
						</div>

						{/* REPRESENTATIVE ARRAY CONSOLIDATED AT THE BASE PATH */}
						<div className="space-y-4">
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
						className="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-all uppercase tracking-widest"
					>
						{loading
							? "Processing Document Saving..."
							: "Save Sample Receipt Record"}
					</button>
				</div>
			</div>
		</main>
	);
}
