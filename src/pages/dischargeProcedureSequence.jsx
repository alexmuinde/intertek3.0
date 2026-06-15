import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function DischargeProcedureSequence() {
	  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    vesselName: "",
    dateOfReport: "",
    portName: "",
    cargoGrade: "",
    berthNumber: "",

    // Parallel array lists tracking matching column steps
    shorelines: [""],
    clientNames: [""],
    rowCargoGrades: [""],
    billOfLadingQuantities: [""],
    shipsTanks: [""],
    shoreTanks: [""],
    rowRemarks: [""],

    manifoldPressureThresholdType: "minimum",
    manifoldPressureValue: "",

    intertekInspector: "",
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
          const res = await fetch(`/api/dischargeProcedureSequence/get/${id}`);
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
      const res = await fetch("/api/dischargeProcedureSequence/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success !== false) {
        alert("Discharge Procedure Sequence Form Saved Successfully!");
        if (!id && data._id) {
          // Strictly maintaining camelCase redirection route flow mapping cleanly with the app shell
          navigate(`/dischargeProcedureSequence/${data._id}`);
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

  // Parallel Arrays Matrix Row Appender
  const handleAddSequenceRow = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      shorelines: [...formData.shorelines, ""],
      clientNames: [...formData.clientNames, ""],
      rowCargoGrades: [...formData.rowCargoGrades, ""],
      billOfLadingQuantities: [...formData.billOfLadingQuantities, ""],
      shipsTanks: [...formData.shipsTanks, ""],
      shoreTanks: [...formData.shoreTanks, ""],
      rowRemarks: [...formData.rowRemarks, ""],
    });
  };

  const handleItemArrayChange = (index, value, field) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleRemoveSequenceRow = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.shorelines.length > 1) {
      setFormData({
        ...formData,
        shorelines: formData.shorelines.filter((_, i) => i !== index),
        clientNames: formData.clientNames.filter((_, i) => i !== index),
        rowCargoGrades: formData.rowCargoGrades.filter((_, i) => i !== index),
        billOfLadingQuantities: formData.billOfLadingQuantities.filter(
          (_, i) => i !== index,
        ),
        shipsTanks: formData.shipsTanks.filter((_, i) => i !== index),
        shoreTanks: formData.shoreTanks.filter((_, i) => i !== index),
        rowRemarks: formData.rowRemarks.filter((_, i) => i !== index),
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
	const inlineInputStyle =
		"bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium focus:border focus:border-black transition-all text-xs text-center mx-1 w-24";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					DISCHARGE PROCEDURE - SEQUENCE
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Split Responsive Workspace */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Framing & Dynamic Sequence Log Matrices */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Context Headers
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<div className="md:col-span-2">
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
								<label className={labelStyle}>Berth</label>
								<input
									onChange={handleChange}
									id="berthNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.berthNumber || ""}
								/>
							</div>
						</div>

						<p className="text-xs font-medium italic text-gray-700 font-serif pl-1 shadow-sm border-l-2 py-1.5 rounded-r bg-gray-50">
							In order to avoid commingling of segregated parcels and facilitate
							smooth discharge, the following procedure/ sequence shall be
							adhered to during the entire discharge operation.
						</p>

						{/* Dynamic Sequencing Tracker Columns Component */}
						<div className="flex flex-col gap-4">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Turnover Step Sequence Table
								</h2>
								<button
									type="button"
									onClick={handleAddSequenceRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-all"
								>
									+ Add Sequence step
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[420px] overflow-y-auto pr-1">
								{formData.shorelines.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Sequence step #{index + 1}
										</span>
										{formData.shorelines.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveSequenceRow(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete
											</button>
										)}
										<div>
											<label className={labelStyle}>Shoreline</label>
											<input
												value={formData.shorelines[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"shorelines",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Client</label>
											<input
												value={formData.clientNames[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"clientNames",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Grade</label>
											<input
												value={formData.rowCargoGrades[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"rowCargoGrades",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>B/Lading Qty</label>
											<input
												value={formData.billOfLadingQuantities[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"billOfLadingQuantities",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Ships Tanks</label>
											<input
												value={formData.shipsTanks[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"shipsTanks",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Shore Tanks</label>
											<input
												value={formData.shoreTanks[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"shoreTanks",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div className="col-span-2">
											<label className={labelStyle}>Remarks</label>
											<input
												value={formData.rowRemarks[index]}
												onChange={(e) =>
													handleItemArrayChange(
														index,
														e.target.value,
														"rowRemarks",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Inline Operational Guidelines, Inspector Signature, and Terminal Witnesses */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Operational Guidelines & Signatures
							</h2>
						</div>

						{/* Narrative Remarks Parameters Guidelines With Inline Custom Pressure Inputs Box */}
						<div className="p-4 bg-amber-50/40 border border-amber-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-sm flex flex-col gap-2">
							<p className="indent-0">
								<strong>Mandatory Guidelines:</strong>
							</p>
							<p className="indent-4">
								1. Ship/shore lines must be air-blown in between parcels and
								shoreline must be pigged prior to discharge of next parcel.
							</p>
							<p className="indent-4">
								2. Vessel to maintain
								<select
									id="manifoldPressureThresholdType"
									className="bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium text-xs rounded mx-1 focus:border"
									onChange={handleChange}
									value={formData.manifoldPressureThresholdType}
								>
									<option value="minimum">minimum</option>
									<option value="maximum">maximum</option>
								</select>
								pressure of
								<input
									onChange={handleChange}
									id="manifoldPressureValue"
									className={inlineInputStyle}
									type="text"
									placeholder="e.g. 7.5"
									required
									value={formData.manifoldPressureValue || ""}
								/>
								Bars at ship's manifold.
							</p>
							<p className="indent-4">
								3. Shore to pig line after discharge of each B/lading parcel.
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

				{/* Submission Action Anchor */}
				<footer className="mt-4 border-t pt-6 bg-transparent">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Discharge Procedure Sequence Report"}
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
