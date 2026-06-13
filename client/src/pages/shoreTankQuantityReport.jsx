import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function ShoreTankQuantityReport() {
	  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    dateOfReport: "",
    vesselName: "",
    portName: "",
    installationName: "",
    productDescription: "",
    operationType: "",

    // Parallel array tracking states initialization for Tank Entries
    overallDipMillimeters: [""],
    productDipMillimeters: [""],
    tankTemperatures: [""],
    densityValues: [""],
    observedVolumeLiters: [""],
    weightMetricTonsInAir: [""],
    datesOfMeasurements: [""],
    timesOfMeasurements: [""],
    measurementRemarks: [""],

    densityTemperatureBasis: "30",
    coefficientFactor: "",

    dippingTapeSerialNumber: "",
    dippingTapeCalibrationCertificateNumber: "",
    dippingTapeExpiryDate: "",
    thermometerSerialNumber: "",
    thermometerCalibrationCertificateNumber: "",
    thermometerExpiryDate: "",

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
          const res = await fetch(`/api/shoreTankQuantityReport/get/${id}`);
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
              dippingTapeExpiryDate: actualReport.dippingTapeExpiryDate
                ? actualReport.dippingTapeExpiryDate.split("T")[0]
                : "",
              thermometerExpiryDate: actualReport.thermometerExpiryDate
                ? actualReport.thermometerExpiryDate.split("T")[0]
                : "",
              datesOfMeasurements: actualReport.datesOfMeasurements
                ? actualReport.datesOfMeasurements.map((d) => (d ? d.split("T")[0] : ""))
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
      const res = await fetch("/api/shoreTankQuantityReport/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success !== false) {
        alert("Record Saved Successfully!");
        if (!id && data._id) {
          navigate(`/shoreTankQuantityReport/${data._id}`);
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

  // Parallel Arrays Master Utility Append for Tank Entries
  const handleAddTankRecord = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      overallDipMillimeters: [...formData.overallDipMillimeters, ""],
      productDipMillimeters: [...formData.productDipMillimeters, ""],
      tankTemperatures: [...formData.tankTemperatures, ""],
      densityValues: [...formData.densityValues, ""],
      observedVolumeLiters: [...formData.observedVolumeLiters, ""],
      weightMetricTonsInAir: [...formData.weightMetricTonsInAir, ""],
      datesOfMeasurements: [...formData.datesOfMeasurements, ""],
      timesOfMeasurements: [...formData.timesOfMeasurements, ""],
      measurementRemarks: [...formData.measurementRemarks, ""],
    });
  };

  const handleTankItemChange = (index, value, field) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleRemoveTankRecord = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.overallDipMillimeters.length > 1) {
      setFormData({
        ...formData,
        overallDipMillimeters: formData.overallDipMillimeters.filter(
          (_, i) => i !== index,
        ),
        productDipMillimeters: formData.productDipMillimeters.filter(
          (_, i) => i !== index,
        ),
        tankTemperatures: formData.tankTemperatures.filter(
          (_, i) => i !== index,
        ),
        densityValues: formData.densityValues.filter((_, i) => i !== index),
        observedVolumeLiters: formData.observedVolumeLiters.filter(
          (_, i) => i !== index,
        ),
        weightMetricTonsInAir: formData.weightMetricTonsInAir.filter(
          (_, i) => i !== index,
        ),
        datesOfMeasurements: formData.datesOfMeasurements.filter(
          (_, i) => i !== index,
        ),
        timesOfMeasurements: formData.timesOfMeasurements.filter(
          (_, i) => i !== index,
        ),
        measurementRemarks: formData.measurementRemarks.filter(
          (_, i) => i !== index,
        ),
      });
    }
  };

  // Grouped Representative Array Item Handlers
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

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					SHORE TANK QUANTITY REPORT
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Flex Layout Container */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Header & Multi Tank Entry Lists */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics Context & Core Identity
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
								<label className={labelStyle}>Product</label>
								<input
									onChange={handleChange}
									id="productDescription"
									className={inputStyle}
									type="text"
									required
									value={formData.productDescription || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Operation</label>
								<input
									onChange={handleChange}
									id="operationType"
									className={inputStyle}
									type="text"
									required
									value={formData.operationType || ""}
								/>
							</div>
						</div>

						{/* Parallel Array Entry Fields for Multiple Tanks */}
						<div className="flex flex-col gap-4 mt-2">
							<div className="flex justify-between items-center bg-gray-100 p-2 border-l-4 border-blue-800">
								<h2 className="text-xs font-bold uppercase tracking-wider">
									Tank Measurement Metric Data Logs
								</h2>
								<button
									type="button"
									onClick={handleAddTankRecord}
									className="text-[10px] bg-black text-white px-3 py-1 font-bold rounded hover:bg-gray-800 transition-all uppercase"
								>
									+ Add Tank Entry
								</button>
							</div>

							<div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-1">
								{formData.overallDipMillimeters.map((_, index) => (
									<div
										key={index}
										className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50/60 p-3 border border-gray-200 rounded relative pt-8"
									>
										<span className="absolute top-1 left-2 text-[10px] font-bold bg-blue-800 text-white px-2 py-0.5 rounded">
											Tank Log #{index + 1}
										</span>
										{formData.overallDipMillimeters.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveTankRecord(index)}
												className="absolute top-1 right-2 text-[10px] border border-red-300 text-red-500 bg-white px-2 py-0.5 rounded hover:bg-red-50 font-bold uppercase"
											>
												Delete Tank
											</button>
										)}
										<div>
											<label className={labelStyle}>Overall Dip (mm)</label>
											<input
												value={formData.overallDipMillimeters[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"overallDipMillimeters",
													)
												}
												className={inputStyle}
												type="number"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Product Dip (mm)</label>
											<input
												value={formData.productDipMillimeters[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"productDipMillimeters",
													)
												}
												className={inputStyle}
												type="number"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Tank Temp (°C)</label>
											<input
												value={formData.tankTemperatures[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"tankTemperatures",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Density</label>
											<input
												value={formData.densityValues[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"densityValues",
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
												Observed Volume (Ltrs)
											</label>
											<input
												value={formData.observedVolumeLiters[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"observedVolumeLiters",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Weight M.Tons (Air)</label>
											<input
												value={formData.weightMetricTonsInAir[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"weightMetricTonsInAir",
													)
												}
												className={inputStyle}
												type="number"
												step="any"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Date of Measurement</label>
											<input
												value={formData.datesOfMeasurements[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"datesOfMeasurements",
													)
												}
												className={inputStyle}
												type="date"
												required
											/>
										</div>
										<div>
											<label className={labelStyle}>Time of Measurement</label>
											<input
												value={formData.timesOfMeasurements[index]}
												onChange={(e) =>
													handleTankItemChange(
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
										<div>
											<label className={labelStyle}>Remarks</label>
											<input
												value={formData.measurementRemarks[index]}
												onChange={(e) =>
													handleTankItemChange(
														index,
														e.target.value,
														"measurementRemarks",
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

						{/* Verification Panel Details Container */}
						<div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs flex flex-wrap items-center gap-2">
							<span className="font-bold uppercase tracking-wider text-gray-700">
								Density at basis option:
							</span>
							<select
								id="densityTemperatureBasis"
								className="bg-white p-1 border border-gray-300 outline-none text-xs font-serif font-medium rounded mx-1 focus:border-black"
								onChange={handleChange}
								value={formData.densityTemperatureBasis}
							>
								<option value="30">30</option>
								<option value="50">50</option>
							</select>
							<span className="font-bold uppercase tracking-wider text-gray-700 ml-2">
								Coefficient Factor:
							</span>
							<input
								onChange={handleChange}
								id="coefficientFactor"
								className="bg-[#f8f6f6] p-1 border-b border-black outline-none font-serif font-medium w-32 focus:border focus:border-black transition-all"
								type="number"
								step="any"
								required
								value={formData.coefficientFactor || ""}
							/>
						</div>
					</div>

					{/* RIGHT HALF: Tool Calibrations, Official Inspector, and Multi Witness List Matrix */}
					<div className="flex-1 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Equipment Verification & Calibration Data
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label className={labelStyle}>Dipping Tape Serial No.</label>
								<input
									onChange={handleChange}
									id="dippingTapeSerialNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.dippingTapeSerialNumber || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Tape Cert No.</label>
								<input
									onChange={handleChange}
									id="dippingTapeCalibrationCertificateNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.dippingTapeCalibrationCertificateNumber || ""}
								/>
							</div>
							<div className="md:col-span-2">
								<label className={labelStyle}>Tape Expiry Date</label>
								<input
									onChange={handleChange}
									id="dippingTapeExpiryDate"
									className={inputStyle}
									type="date"
									required
									value={formData.dippingTapeExpiryDate || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Thermometer Serial No.</label>
								<input
									onChange={handleChange}
									id="thermometerSerialNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.thermometerSerialNumber || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Thermometer Cert No.</label>
								<input
									onChange={handleChange}
									id="thermometerCalibrationCertificateNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.thermometerCalibrationCertificateNumber || ""}
								/>
							</div>
							<div className="md:col-span-2">
								<label className={labelStyle}>Thermometer Expiry Date</label>
								<input
									onChange={handleChange}
									id="thermometerExpiryDate"
									className={inputStyle}
									type="date"
									required
									value={formData.thermometerExpiryDate || ""}
								/>
							</div>
						</div>

						<div className="border-t border-gray-100 pt-4">
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
				<footer className="mt-4 border-t pt-6">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Official Document Data..."
							: "Submit Shore Tank Quantity Report"}
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
