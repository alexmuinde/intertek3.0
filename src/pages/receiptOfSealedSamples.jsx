import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function ReceiptOfSealedSamples() {
	  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    intertekInspector: "",
    vesselName: "",
    clientName: "",
    portOfLoading: "",
    dateOfReport: "",
    cargoDescription: "",

    // Parallel dynamic arrays initialization for Sample Logging rows
    sampleGrades: [""],
    sizesOfSamples: [""],
    sealNumbers: [""],
    sampleDescriptions: [""],

    // Grouped state structure moved to the end
    representatives: [
      {
        representativeName: "",
        representativeIdentification: "",
        representativeEmail: "",
      },
    ],
  });

  // Balanced effect processing hook accommodating fallback or nested response layouts
  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/receiptOfSealedSamples/get/${id}`);
          const data = await res.json();
          if (data.success !== false) {
            // Check if backend uses the new wrapped style, otherwise fallback to root data object
            const actualReport = data.report ? data.report : data;
            
            // Handle authorization validation check
            const isOwnerCheck = data.isOwner !== undefined 
              ? data.isOwner 
              : (actualReport.userReference === currentUser?._id);

            setCanEdit(isOwnerCheck);

            setFormData({
              ...actualReport,
              dateOfReport: actualReport.dateOfReport
                ? actualReport.dateOfReport.split("T")[0]
                : "",
            });
          } else {
            setError(data.message || "Failed to decode backend payload records");
          }
        } catch (err) {
          setError("Network exception caught streaming record database files");
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [id, currentUser?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setLoading(true);
    setError(false);
    try {
      const body = id ? { ...formData, _id: id } : formData;
      const res = await fetch("/api/receiptOfSealedSamples/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success !== false) {
        alert("Record Saved Successfully!");
        if (!id && data._id) {
          navigate(`/receiptOfSealedSamples/${data._id}`);
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
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Parallel Arrays Row Appender Utility
  const handleAddSampleRecordRow = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      sampleGrades: [...formData.sampleGrades, ""],
      sizesOfSamples: [...formData.sizesOfSamples, ""],
      sealNumbers: [...formData.sealNumbers, ""],
      sampleDescriptions: [...formData.sampleDescriptions, ""],
    });
  };

  const handleSampleItemChange = (index, value, field) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleRemoveSampleRecordRow = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.sampleGrades.length > 1) {
      setFormData({
        ...formData,
        sampleGrades: formData.sampleGrades.filter((_, i) => i !== index),
        sizesOfSamples: formData.sizesOfSamples.filter((_, i) => i !== index),
        sealNumbers: formData.sealNumbers.filter((_, i) => i !== index),
        sampleDescriptions: formData.sampleDescriptions.filter(
          (_, i) => i !== index,
        ),
      });
    }
  };

  // Grouped Representative Array Rows Handlers
  const handleAddRepresentativeRow = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
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
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedRepresentatives = [...formData.representatives];
    updatedRepresentatives[index][field] = value;
    setFormData({ ...formData, representatives: updatedRepresentatives });
  };

  const handleRemoveRepresentativeRow = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.representatives.length > 1) {
      setFormData({
        ...formData,
        representatives: formData.representatives.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-serif font-bold uppercase tracking-widest text-gray-600">
        Syncing inspector document registry matrix streams...
      </div>
    );
  }


	const inputStyle =
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:border-black text-xs font-serif font-medium";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					RECEIPT OF SEALED SAMPLES
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Split Responsive Layout Frame Layout */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Framing & Dynamic Samples Data Entry Cards */}
					<div className="flex-1 flex flex-col gap-5">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Context Header
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="md:col-span-2">
								<label className={labelStyle}>Intertek Inspector</label>
								<input
									onChange={handleChange}
									id="intertekInspector"
									className={inputStyle}
									type="text"
									placeholder="Inspector Full Name"
									required
									value={formData.intertekInspector || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Vessel</label>
								<input
									onChange={handleChange}
									id="vesselName"
									className={inputStyle}
									type="text"
									placeholder="Vessel Name"
									required
									value={formData.vesselName || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Client</label>
								<input
									onChange={handleChange}
									id="clientName"
									className={inputStyle}
									type="text"
									placeholder="Client Name"
									required
									value={formData.clientName || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Port of Loading</label>
								<input
									onChange={handleChange}
									id="portOfLoading"
									className={inputStyle}
									type="text"
									placeholder="Port Location"
									required
									value={formData.portOfLoading || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Date</label>
								<input
									onChange={handleChange}
									id="dateOfReport"
									className={inputStyle}
									type="date"
									required
									value={formData.dateOfReport || ""}
								/>
							</div>
							<div className="md:col-span-2">
								<label className={labelStyle}>Cargo</label>
								<input
									onChange={handleChange}
									id="cargoDescription"
									className={inputStyle}
									type="text"
									placeholder="Cargo Details"
									required
									value={formData.cargoDescription || ""}
								/>
							</div>
						</div>

						{/* Dynamic Track Table Row Component Grid */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Sealed Samples Registry List
								</h2>
								<button
									type="button"
									onClick={handleAddSampleRecordRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-all"
								>
									+ Add Sample Row
								</button>
							</div>

							<p className="text-xs font-bold italic tracking-wide text-gray-700 pl-1">
								Please acknowledge receipt of the listed samples.
							</p>

							<div className="flex flex-col gap-5 max-h-[400px] overflow-y-auto pr-1">
								{formData.sampleGrades.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Sample #{index + 1}
										</span>
										{formData.sampleGrades.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveSampleRecordRow(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete
											</button>
										)}
										<div className="col-span-2 md:col-span-4">
											<label className={labelStyle}>Grade</label>
											<input
												value={formData.sampleGrades[index]}
												onChange={(e) =>
													handleSampleItemChange(
														index,
														e.target.value,
														"sampleGrades",
													)
												}
												className={inputStyle}
												type="text"
												placeholder="Cargo Grade"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Size of Samples</label>
											<input
												value={formData.sizesOfSamples[index]}
												onChange={(e) =>
													handleSampleItemChange(
														index,
														e.target.value,
														"sizesOfSamples",
													)
												}
												className={inputStyle}
												type="text"
												placeholder="e.g. 1 Litre"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Seal Number</label>
											<input
												value={formData.sealNumbers[index]}
												onChange={(e) =>
													handleSampleItemChange(
														index,
														e.target.value,
														"sealNumbers",
													)
												}
												className={inputStyle}
												type="text"
												placeholder="e.g. INT003948"
												required
											/>
										</div>
										<div className="col-span-2 md:col-span-2">
											<label className={labelStyle}>Description</label>
											<input
												value={formData.sampleDescriptions[index]}
												onChange={(e) =>
													handleSampleItemChange(
														index,
														e.target.value,
														"sampleDescriptions",
													)
												}
												className={inputStyle}
												type="text"
												placeholder="Sample appearance/source notes"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Refactored Grouped Multiple Representatives Array Section at the End */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Official Authorization & Signatures
							</h2>
						</div>

						{/* Grouped Dynamic Client Witness List Matrix Container */}
						<div className="space-y-4">
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

							<div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-1">
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
												placeholder="ID / Passport Number"
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
							? "Processing Document Data..."
							: "Submit Receipt of Sealed Samples"}
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
