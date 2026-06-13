import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function LetterOfProtestShoreFinalOutturnFigures() {
	  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    recipientName: "",
    vesselName: "",
    dateOfReport: "",
    cargoGrade: "",
    portName: "",
    dateOfProvisionalProtestReport: "",

    // Parallel string tracking states for multiple calculation sets
    billOfLadingFigures: [""],
    shoreFinalOutturnFigures: [""],
    metricTonsDifferences:[0],
    percentageDifferences: [0],

    intertekInspector: "",
    representatives: [
      {
        representativeName: "",
        representativeIdentification: "",
        representativeEmail: "",
      },
    ],
  });

  // --- DYNAMIC REAL-TIME AGGREGATE COMPUTATION MATH ENGINE ---
  useEffect(() => {
    const updatedMetricTonsDiffs = formData.billOfLadingFigures.map(
      (blVal, index) => {
        const bl = parseFloat(blVal);
        const outturn = parseFloat(formData.shoreFinalOutturnFigures[index]);
        if (bl && outturn) {
          return parseFloat(Math.abs(bl - outturn).toFixed(3));
        }
        return 0;
      },
    );

    const updatedPercentageDiffs = formData.billOfLadingFigures.map(
      (blVal, index) => {
        const bl = parseFloat(blVal);
        const diff = updatedMetricTonsDiffs[index];
        if (bl && bl !== 0 && diff) {
          return parseFloat(((diff / bl) * 100).toFixed(3));
        }
        return 0;
      },
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      metricTonsDifferences: updatedMetricTonsDiffs,
      percentageDifferences: updatedPercentageDiffs,
    }));
  }, [formData.billOfLadingFigures, formData.shoreFinalOutturnFigures]);

  // Balanced effect processing hook accommodating fallback or nested response layouts
  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/letterOfProtestShoreFinalOutturnFigures/get/${id}`,
          );
          const data = await res.json();
          if (data.success !== false) {
            // Check if backend uses the new wrapped style, otherwise fallback to root data object
            const actualReport = data.report ? data.report : data;
            
            // Handle authorization validation check
            const isOwnerCheck = data.isOwner !== undefined 
              ? data.isOwner 
              : (actualReport.userReference === currentUser?._id);

            setCanEdit(isOwnerCheck);

            // Locate this section inside the useEffect hook and update it to this:
			setFormData({
			...actualReport,
			dateOfReport: actualReport.dateOfReport
				? actualReport.dateOfReport.split("T")[0] // Added [0] here
				: "",
			dateOfProvisionalProtestReport: actualReport.dateOfProvisionalProtestReport
				? actualReport.dateOfProvisionalProtestReport.split("T")[0] // Added [0] here
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
      const res = await fetch(
        "/api/letterOfProtestShoreFinalOutturnFigures/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json();
      if (data.success !== false) {
        alert("Letter of Protest Saved Successfully!");
        if (!id && data._id) {
          navigate(`/letterOfProtestShoreFinalOutturnFigures/${data._id}`);
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

  // Parallel Arrays Master Row Appender
  const handleAddOutturnRow = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      billOfLadingFigures: [...formData.billOfLadingFigures, ""],
      shoreFinalOutturnFigures: [...formData.shoreFinalOutturnFigures, ""],
      metricTonsDifferences: [...formData.metricTonsDifferences, 0],
      percentageDifferences: [...formData.percentageDifferences, 0],
    });
  };

  const handleItemArrayChange = (index, value, field) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleRemoveOutturnRow = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.billOfLadingFigures.length > 1) {
      setFormData({
        ...formData,
        billOfLadingFigures: formData.billOfLadingFigures.filter(
          (_, i) => i !== index,
        ),
        shoreFinalOutturnFigures: formData.shoreFinalOutturnFigures.filter(
          (_, i) => i !== index,
        ),
        metricTonsDifferences: formData.metricTonsDifferences.filter(
          (_, i) => i !== index,
        ),
        percentageDifferences: formData.percentageDifferences.filter(
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
		"w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-xs font-serif font-medium";
	const inlineInputStyle =
		"bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium focus:border focus:border-black transition-all text-xs text-center mx-1 w-32";
	const readOnlyStyle =
		"w-full bg-gray-100 p-2 border-b border-gray-400 outline-none text-xs font-serif font-bold text-blue-800 cursor-not-allowed";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					LETTER OF PROTEST - SHORE FINAL OUTTURN FIGURES
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Flex Layout Container Grid Display */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Logistics Header Context & Metrics Data Logger Tracker Row */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Summary Context
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
									placeholder="Recipient Authority / Gantry Manager"
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
								<label className={labelStyle}>Grade</label>
								<input
									onChange={handleChange}
									id="cargoGrade"
									className={inputStyle}
									type="text"
									required
									value={formData.cargoGrade || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Port Location</label>
								<input
									onChange={handleChange}
									id="portName"
									className={inputStyle}
									type="text"
									required
									value={formData.portName || ""}
								/>
							</div>
						</div>

						{/* Narrative Provisional Paragraph Reference Statements Box */}
						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-sm">
							<p className="indent-0">
								Further to our letter of protest on shore provisional outturn
								figures dated
								<input
									onChange={handleChange}
									id="dateOfProvisionalProtestReport"
									className={inlineInputStyle}
									type="date"
									required
									value={formData.dateOfProvisionalProtestReport || ""}
								/>
								on the subject matter, please be informed that we have finalized
								shore outturn and noted the following weight discrepancy:
							</p>
						</div>

						{/* Dynamic Track Operational Row Logger Table */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Final Outturn Metrics Evaluation Matrix
								</h2>
								<button
									type="button"
									onClick={handleAddOutturnRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-all"
								>
									+ Add Product Entry
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[450px] overflow-y-auto pr-1">
								{formData.billOfLadingFigures.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Product Slot #{index + 1}
										</span>
										{formData.billOfLadingFigures.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveOutturnRow(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete Row
											</button>
										)}
										<div>
											<label className={labelStyle}>
												Bill of Lading Figure
											</label>
											<input
												value={formData.billOfLadingFigures[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"billOfLadingFigures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>
												Shore Final Outturn Figure
											</label>
											<input
												value={formData.shoreFinalOutturnFigures[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"shoreFinalOutturnFigures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Difference (Auto)</label>
											<input
												value={formData.metricTonsDifferences[index] || ""}
												className={readOnlyStyle}
												type="number"
												readOnly
											/>
										</div>
										<div>
											<label className={labelStyle}>% Difference (Auto)</label>
											<input
												value={formData.percentageDifferences[index] || ""}
												className={readOnlyStyle}
												type="number"
												readOnly
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Official Protest Warnings, Inspector Sign-Off, and Witnesses Object Array */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Official Protest Notification & Signatures
							</h2>
						</div>

						{/* Legal Disclaimer Statements Context Profile Box */}
						<div className="bg-amber-50/60 p-4 border border-amber-200 rounded text-[11px] text-gray-700 leading-relaxed font-serif italic">
							<p className="indent-0">
								Accordingly we are compelled to lodge protest/Notice of claim in
								respect to the above and reserve all rights of our principals/
								whom it may concern to refer to you this matter at a later date.
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

						{/* Grouped Dynamic Client Witness List Matrix Container at the End */}
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
							? "Processing Document Data..."
							: "Submit Shore Final Outturn Figures Protest"}
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
