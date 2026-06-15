import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function PumpingPressureLog() {
	  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    vesselName: "",
    portName: "",
    dateOfReport: "",
    cargoDescription: "",

    // Parallel array lists initialization tracking status lines
    datesOfLogEntries: [""],
    timesOfLogEntries: [""],
    manifoldPressures: [""],

    minimumRequestedPressure: "",
    maximumRequestedPressure: "",

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
          const res = await fetch(`/api/pumpingPressureLog/get/${id}`);
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
              datesOfLogEntries: actualReport.datesOfLogEntries
                ? actualReport.datesOfLogEntries.map((d) => (d ? d.split("T")[0] : ""))
                : [""],
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
      const res = await fetch("/api/pumpingPressureLog/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success !== false) {
        alert("Pressure Log Records Saved Successfully!");
        if (!id && data._id) {
          navigate(`/pumpingPressureLog/${data._id}`);
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

  // Parallel Arrays Row Appender
  const handleAddLogRecordRow = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      datesOfLogEntries: [...formData.datesOfLogEntries, ""],
      timesOfLogEntries: [...formData.timesOfLogEntries, ""],
      manifoldPressures: [...formData.manifoldPressures, ""],
    });
  };

  const handleLogItemChange = (index, value, field) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleRemoveLogRecordRow = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.datesOfLogEntries.length > 1) {
      setFormData({
        ...formData,
        datesOfLogEntries: formData.datesOfLogEntries.filter(
          (_, i) => i !== index,
        ),
        timesOfLogEntries: formData.timesOfLogEntries.filter(
          (_, i) => i !== index,
        ),
        manifoldPressures: formData.manifoldPressures.filter(
          (_, i) => i !== index,
        ),
      });
    }
  };

  // Grouped Representative Object Row Handlers
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
					PUMPING PRESSURE LOG
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Flex Layout Container on Desktop viewports */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Logistics Header Context & Timeline Metrics Matrix */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Vessel Logistics Header
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

						{/* Dynamic Interactive Gauge Row Logger Component */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Manifold Pressure Tracking History
								</h2>
								<button
									type="button"
									onClick={handleAddLogRecordRow}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded uppercase hover:bg-gray-800 transition-all"
								>
									+ Add Pressure Entry
								</button>
							</div>

							<div className="flex flex-col gap-5 max-h-[450px] overflow-y-auto pr-1">
								{formData.datesOfLogEntries.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Log Row #{index + 1}
										</span>
										{formData.datesOfLogEntries.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveLogRecordRow(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete
											</button>
										)}
										<div>
											<label className={labelStyle}>Date</label>
											<input
												value={formData.datesOfLogEntries[index]}
												onChange={(e) =>
													handleLogItemChange(
														index,
														e.target.value,
														"datesOfLogEntries",
													)
												}
												className={inputStyle}
												type="date"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Time</label>
											<input
												value={formData.timesOfLogEntries[index]}
												onChange={(e) =>
													handleLogItemChange(
														index,
														e.target.value,
														"timesOfLogEntries",
													)
												}
												className={inputStyle}
												type="time"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Manifold Pressure</label>
											<input
												value={formData.manifoldPressures[index]}
												onChange={(e) =>
													handleLogItemChange(
														index,
														e.target.value,
														"manifoldPressures",
													)
												}
												className={inputStyle}
												type="text"
												placeholder="e.g. 4.5 Bar"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Inline Boundaries, Inspector, and Grouped Multiple Witnesses at the End */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Operational Operational Limits & Signatures
							</h2>
						</div>

						{/* Official Target Parameters Context Statements Inline Input Box */}
						<div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-serif leading-relaxed text-gray-800 shadow-sm">
							<p className="indent-0">
								Shore requests pressure at ship's manifold to be minimum
								<input
									onChange={handleChange}
									id="minimumRequestedPressure"
									className={inlineInputStyle}
									type="text"
									placeholder="e.g. 2.0 Bar"
									required
									value={formData.minimumRequestedPressure || ""}
								/>
								and maximum
								<input
									onChange={handleChange}
									id="maximumRequestedPressure"
									className={inlineInputStyle}
									type="text"
									placeholder="e.g. 7.0 Bar"
									required
									value={formData.maximumRequestedPressure || ""}
								/>
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
									Witness Representatives Authentication
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
							: "Submit Pumping Pressure Log"}
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
