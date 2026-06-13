import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function ShoreTankMeasurementData() {
	    const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    dateOfReport: "",
    installationName: "",
    tankNumberHeader: "",
    vesselName: "",
    accountName: "",
    cargoGrade: "",

    // Parallel array lists initialized for multiple metric card tracks
    tankNumbers: [""],
    overallDips: [""],
    productDips: [""],
    temperatures: [""],
    timesOfMeasurements: [""],

    isBeforeDischarge: false,
    isAfterDischarge: false,
    isUpperSample: false,
    isMiddleSample: false,
    isLowerSample: false,
    isRunningSample: false,
    isProfileSample: false,
    numberOfSamples: "",

    isSamplingForDensity: false,
    isSamplingForAnalysis: false,
    isSamplingForRetention: false,

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

  // Balanced effect processing hook accommodating fallback or nested response layouts
  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/shoreTankMeasurementData/get/${id}`);
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
      const res = await fetch("/api/shoreTankMeasurementData/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success !== false) {
        alert("Record Saved Successfully!");
        if (!id && data._id) {
          navigate(`/shoreTankMeasurementData/${data._id}`);
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
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  // Parallel Arrays Row Appender Utility for Dip Tickets
  const handleAddMeasurementRecord = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      tankNumbers: [...formData.tankNumbers, ""],
      overallDips: [...formData.overallDips, ""],
      productDips: [...formData.productDips, ""],
      temperatures: [...formData.temperatures, ""],
      timesOfMeasurements: [...formData.timesOfMeasurements, ""],
    });
  };

  const handleMeasurementItemChange = (index, value, field) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleRemoveMeasurementRecord = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.tankNumbers.length > 1) {
      setFormData({
        ...formData,
        tankNumbers: formData.tankNumbers.filter((_, i) => i !== index),
        overallDips: formData.overallDips.filter((_, i) => i !== index),
        productDips: formData.productDips.filter((_, i) => i !== index),
        temperatures: formData.temperatures.filter((_, i) => i !== index),
        timesOfMeasurements: formData.timesOfMeasurements.filter(
          (_, i) => i !== index,
        ),
      });
    }
  };

  // Grouped Representative Object Dynamic Array Handlers
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
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";
	const checkboxContainerStyle =
		"flex items-center gap-3 p-1.5 hover:bg-gray-50 border-b border-gray-100";

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					SHORE TANK MEASUREMENT DATA (DIP TICKET)
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Flex Layout Structure for Desktop Split Display */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Header & Multi Measurement Row Entries */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Summary Context
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								<label className={labelStyle}>Installation</label>
								<input
									onChange={handleChange}
									id="installationName"
									className={inputStyle}
									type="text"
									required
									value={formData.installationName || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Tank Number Header</label>
								<input
									onChange={handleChange}
									id="tankNumberHeader"
									className={inputStyle}
									type="text"
									required
									value={formData.tankNumberHeader || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Vessel Name</label>
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
								<label className={labelStyle}>Account</label>
								<input
									onChange={handleChange}
									id="accountName"
									className={inputStyle}
									type="text"
									required
									value={formData.accountName || ""}
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
						</div>

						{/* Dynamic Interactive Metrics Row Component Track */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Tank Dip Metrics Log Entries
								</h2>
								<button
									type="button"
									onClick={handleAddMeasurementRecord}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded hover:bg-gray-800 transition-all uppercase"
								>
									+ Add Measurement Row
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-1">
								{formData.tankNumbers.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Tank Log #{index + 1}
										</span>
										{formData.tankNumbers.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveMeasurementRecord(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete
											</button>
										)}
										<div>
											<label className={labelStyle}>Tank No.</label>
											<input
												value={formData.tankNumbers[index]}
												onChange={(e) =>
													handleMeasurementItemChange(
														index,
														e.target.value,
														"tankNumbers",
													)
												}
												className={inputStyle}
												type="text"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Overall Dip</label>
											<input
												value={formData.overallDips[index]}
												onChange={(e) =>
													handleMeasurementItemChange(
														index,
														e.target.value,
														"overallDips",
													)
												}
												className={inputStyle}
												type="number"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Product Dip</label>
											<input
												value={formData.productDips[index]}
												onChange={(e) =>
													handleMeasurementItemChange(
														index,
														e.target.value,
														"productDips",
													)
												}
												className={inputStyle}
												type="number"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Temperature (°C)</label>
											<input
												value={formData.temperatures[index]}
												onChange={(e) =>
													handleMeasurementItemChange(
														index,
														e.target.value,
														"temperatures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Time</label>
											<input
												value={formData.timesOfMeasurements[index]}
												onChange={(e) =>
													handleMeasurementItemChange(
														index,
														e.target.value,
														"timesOfMeasurements",
													)
												}
												className={inputStyle}
												type="time"
												required
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT HALF: Sampling Checkboxes, Reasons Matrix, and Witnesses Object List */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Sampling Context Specifications
							</h2>
						</div>

						{/* Sampling Checklist Split Grid Array */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5 bg-gray-50 p-3 border border-gray-100 rounded">
								<span className="text-[10px] font-bold text-gray-400 font-serif uppercase tracking-wider mb-1">
									Sampling Timeline & Dips
								</span>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isBeforeDischarge"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isBeforeDischarge}
									/>
									<label
										htmlFor="isBeforeDischarge"
										className="text-[11px] cursor-pointer font-medium"
									>
										Before Discharge
									</label>
								</div>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isAfterDischarge"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isAfterDischarge}
									/>
									<label
										htmlFor="isAfterDischarge"
										className="text-[11px] cursor-pointer font-medium"
									>
										After Discharge
									</label>
								</div>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isUpperSample"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isUpperSample}
									/>
									<label
										htmlFor="isUpperSample"
										className="text-[11px] cursor-pointer font-medium"
									>
										Upper
									</label>
								</div>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isMiddleSample"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isMiddleSample}
									/>
									<label
										htmlFor="isMiddleSample"
										className="text-[11px] cursor-pointer font-medium"
									>
										Middle
									</label>
								</div>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isLowerSample"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isLowerSample}
									/>
									<label
										htmlFor="isLowerSample"
										className="text-[11px] cursor-pointer font-medium"
									>
										Lower
									</label>
								</div>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isRunningSample"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isRunningSample}
									/>
									<label
										htmlFor="isRunningSample"
										className="text-[11px] cursor-pointer font-medium"
									>
										Running
									</label>
								</div>
								<div className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id="isProfileSample"
										className="w-4 h-4 cursor-pointer"
										checked={formData.isProfileSample}
									/>
									<label
										htmlFor="isProfileSample"
										className="text-[11px] cursor-pointer font-medium"
									>
										Profile
									</label>
								</div>
								<div className="pt-2">
									<label className={labelStyle}>Number of Samples</label>
									<input
										onChange={handleChange}
										id="numberOfSamples"
										className={inputStyle}
										type="number"
										required
										value={formData.numberOfSamples || ""}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1.5 bg-gray-50 p-3 border border-gray-100 rounded">
									<span className="text-[10px] font-bold text-gray-400 font-serif uppercase tracking-wider mb-1">
										Reason for Sampling
									</span>
									<div className={checkboxContainerStyle}>
										<input
											onChange={handleChange}
											type="checkbox"
											id="isSamplingForDensity"
											className="w-4 h-4 cursor-pointer"
											checked={formData.isSamplingForDensity}
										/>
										<label
											htmlFor="isSamplingForDensity"
											className="text-[11px] cursor-pointer font-medium"
										>
											Density
										</label>
									</div>
									<div className={checkboxContainerStyle}>
										<input
											onChange={handleChange}
											type="checkbox"
											id="isSamplingForAnalysis"
											className="w-4 h-4 cursor-pointer"
											checked={formData.isSamplingForAnalysis}
										/>
										<label
											htmlFor="isSamplingForAnalysis"
											className="text-[11px] cursor-pointer font-medium"
										>
											Analysis
										</label>
									</div>
									<div className={checkboxContainerStyle}>
										<input
											onChange={handleChange}
											type="checkbox"
											id="isSamplingForRetention"
											className="w-4 h-4 cursor-pointer"
											checked={formData.isSamplingForRetention}
										/>
										<label
											htmlFor="isSamplingForRetention"
											className="text-[11px] cursor-pointer font-medium"
										>
											Retention
										</label>
									</div>
								</div>

								<div>
									<label className={labelStyle}>Measurement Remarks</label>
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
							</div>
						</div>

						{/* Grouped Dynamic Witness List Container */}
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

							<div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
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
				<footer className="mt-4 border-t pt-6">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Shore Tank Measurement Data"}
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
