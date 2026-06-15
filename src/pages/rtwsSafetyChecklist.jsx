import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function RtwsSafetyChecklist() {
	  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Toggles view vs write configuration settings

  const [formData, setFormData] = useState({
    userReference: currentUser?._id,
    intertekInspector: "",
    timeOfInspection: "",
    dateOfInspection: "",
    placeOfInspection: "",
    clientName: "",
    truckNumber: "",
    transporterCompany: "",
    driversName: "",
    previousCargo: "",
    driversIdentification: "",
    cargoToLoad: "",

    compartmentCapacities: [""],
    totalCompartmentCapacity: 0, // Read-Only Auto-calculated state parameter

    hasNoPreviousLeaks: false,
    hasSeatBeltsFitted: false,
    areSeatBeltsMaintained: false,
    hasSpeedGovernorCertificate: false,
    hasFireExtinguisher: false,
    hasSafetyToolsAndSpareWheel: false,
    hasStoppersFitted: false,
    areTiresFreeFromWear: false,
    wasRiskAssessmentCarriedOut: false,
    wereAllDocumentsChecked: false,
    wereCapsAndValvesRemoved: false,
    areCompartmentsCleanDryOdorFree: false,
    areTopSurfacesCleanAndSafe: false,
    wereUndersideHatchesInspected: false,
    werePersonalProtectiveEquipmentUsed: false,
    wasRagTestPerformed: false,
    areInternalSurfacesCleanDryOdorFree: false,
    wereCoamingAreasInspected: false,
    wasCertificateStatusCompleted: false,
    wereRejectionReasonsStipulated: false,
    wasCertificateDulyFilled: false,
    wasCertificateCopyRetained: false,
    wasSamePreviousCargoConfirmed: false,
    wasForeignProductAbsenceVerified: false,
    wasSecondOpinionSought: false,
    wereDipsticksVerifiedAtInspection: false,
    wereDipsticksVerifiedAtGantry: false,
  });

  // --- REAL-TIME AUTOMATIC TOTAL CAPACITY COMPUTATION ENGINE ---
  useEffect(() => {
    const calculatedGrandTotal = formData.compartmentCapacities.reduce(
      (accumulator, currentCapacityValue) =>
        accumulator + (parseFloat(currentCapacityValue) || 0),
      0,
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      totalCompartmentCapacity: calculatedGrandTotal,
    }));
  }, [formData.compartmentCapacities]);

  // Balanced effect processing hook accommodating fallback or nested response layouts
  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/rtwsSafetyChecklist/get/${id}`);
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
              dateOfInspection: actualReport.dateOfInspection
                ? actualReport.dateOfInspection.split("T")
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
      const res = await fetch("/api/rtwsSafetyChecklist/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success !== false) {
        alert("Safety Checklist Records Saved Successfully!");
        if (!id && data._id) {
          navigate(`/rtwsSafetyChecklist/${data._id}`);
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

  const handleAddCompartmentRow = () => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    setFormData({
      ...formData,
      compartmentCapacities: [...formData.compartmentCapacities, ""],
    });
  };

  const handleCompartmentItemChange = (index, value) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    const updatedList = [...formData.compartmentCapacities];
    updatedList[index] = value;
    setFormData({ ...formData, compartmentCapacities: updatedList });
  };

  const handleRemoveCompartmentRow = (index) => {
    if (!canEdit) return; // Explicit structural script blocker safety guard
    if (formData.compartmentCapacities.length > 1) {
      setFormData({
        ...formData,
        compartmentCapacities: formData.compartmentCapacities.filter(
          (_, i) => i !== index,
        ),
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
	// FIXED: Stripped box shadows and solid enclosing side borders to align style accurately
	const borderlessInputStyle =
		"w-full bg-[#f8f6f6] p-2 border-none outline-none text-xs font-serif font-medium transition-all focus:border focus:border-black focus:shadow-[2px_2px_rgba(0,0,0,0.19)]";
	const readOnlyStyle =
		"w-full bg-gray-100 p-2 border-b border-gray-400 outline-none text-xs font-serif font-bold text-blue-800 cursor-not-allowed";
	const labelStyle =
		"block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";
	const checkboxContainerStyle =
		"flex items-center gap-3 p-1.5 hover:bg-gray-50 border-b border-gray-100";

	const checklistQuestions = [
		{
			id: "hasNoPreviousLeaks",
			text: "1. Did the truck show any signs of leakage from previous assignment?",
		},
		{
			id: "hasSeatBeltsFitted",
			text: "2. Is the truck fitted with seat belts both for driver and passenger?",
		},
		{
			id: "areSeatBeltsMaintained",
			text: "3. Are the seat belts in the truck well maintained?",
		},
		{
			id: "hasSpeedGovernorCertificate",
			text: "4. Is the truck fitted with speed governors and original certificate displayed?",
		},
		{
			id: "hasFireExtinguisher",
			text: "5. Is the vehicle fitted with fire extinguisher?",
		},
		{
			id: "hasSafetyToolsAndSpareWheel",
			text: "6. Was the vehicle fitted with a spare wheel, jack, wheel spanners and life savers?",
		},
		{
			id: "hasStoppersFitted",
			text: "7. Was the vehicle fitted with stoppers at the time of inspection?",
		},
		{
			id: "areTiresFreeFromWear",
			text: "8. Were vehicle tires free from bulges and no excessive wear?",
		},
		{
			id: "wasRiskAssessmentCarriedOut",
			text: "9. Was risk assessment carried out by our inspector prior to inspection?",
		},
		{
			id: "wereAllDocumentsChecked",
			text: "10. Were all documents presented by driver or client checked?",
		},
		{
			id: "wereCapsAndValvesRemoved",
			text: "11. Did the driver remove dust caps and manifold valves prior to inspection?",
		},
		{
			id: "areCompartmentsCleanDryOdorFree",
			text: "12. Were all compartments inspected and found clean, dry and odour free?",
		},
		{
			id: "areTopSurfacesCleanAndSafe",
			text: "13. Were surfaces on top of the RTW, around the manifold found clean, dry and safe?",
		},
		{
			id: "wereUndersideHatchesInspected",
			text: "14. Were the underside of hatches and sealing gaskets on top the RTW inspected?",
		},
		{
			id: "werePersonalProtectiveEquipmentUsed",
			text: "15. Were PPE used and extreme care taken while entering and exiting compartment?",
		},
		{
			id: "wasRagTestPerformed",
			text: "16. Were internal surfaces inspected and randomly tested with a light colored rag?",
		},
		{
			id: "areInternalSurfacesCleanDryOdorFree",
			text: "17. Were all internal surfaces confirmed to be clean, dry and odor free?",
		},
		{
			id: "wereCoamingAreasInspected",
			text: "18. Were coaming areas around the man-hole inside the tanker carefully inspected?",
		},
		{
			id: "wasCertificateStatusCompleted",
			text: "19. Was TIC completed, clearly indicating whether it was accepted or rejected?",
		},
		{
			id: "wereRejectionReasonsStipulated",
			text: "20. Were reasons for rejection clearly stipulated on the certificate?",
		},
		{
			id: "wasCertificateDulyFilled",
			text: "21. Was TIC duly filled with relevant information?",
		},
		{
			id: "wasCertificateCopyRetained",
			text: "22. Was original TIC given to the driver and a copy retained for internal use?",
		},
		{
			id: "wasSamePreviousCargoConfirmed",
			text: "23. Were documents for RTWS loading same products as previous checked to confirm whether or not the previous cargo was exactly the same?",
		},
		{
			id: "wasForeignProductAbsenceVerified",
			text: "24. Were interior surfaces, manifolds and valves of RTWS loading the same products and previous inspected to confirm no presence of foreign products?",
		},
		{
			id: "wasSecondOpinionSought",
			text: "25. Was second opinion sought before passing the tank?",
		},
		{
			id: "wereDipsticksVerifiedAtInspection",
			text: "26. Were all dipsticks verified against TT marks and were markings on the dipsticks confirmed to be corresponding with the trailer / wagon number during inspection?",
		},
		{
			id: "wereDipsticksVerifiedAtGantry",
			text: "27. Were all dipsticks verified against TT marks and were markings on the dipsticks confirmed to be corresponding with the trailer / wagon number before loading at the loading gantry?",
		},
	];

	return (
		<main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900">
			<header className="mb-4 border-b-2 border-black pb-2">
				<h1 className="text-base font-bold text-center uppercase tracking-widest">
					RTWS SAFETY CHECKLIST
				</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				{/* Side-by-Side Split Flex Grid Structural Layout Box */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* LEFT HALF: Document Logistics Framing & Dynamic Compartments Matrix */}
					<div className="flex-1 flex flex-col gap-5">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Logistics & Survey Profiles
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
									required
									value={formData.intertekInspector || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Time of Inspection</label>
								<input
									onChange={handleChange}
									id="timeOfInspection"
									className={inputStyle}
									type="time"
									required
									value={formData.timeOfInspection || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Date of Inspection</label>
								<input
									onChange={handleChange}
									id="dateOfInspection"
									className={inputStyle}
									type="date"
									required
									value={formData.dateOfInspection || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Place of Inspection</label>
								<input
									onChange={handleChange}
									id="placeOfInspection"
									className={inputStyle}
									type="text"
									required
									value={formData.placeOfInspection || ""}
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
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-3">
							<div>
								<label className={labelStyle}>Truck Number</label>
								<input
									onChange={handleChange}
									id="truckNumber"
									className={inputStyle}
									type="text"
									required
									value={formData.truckNumber || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Transporter</label>
								<input
									onChange={handleChange}
									id="transporterCompany"
									className={inputStyle}
									type="text"
									required
									value={formData.transporterCompany || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Driver's Name</label>
								<input
									onChange={handleChange}
									id="driversName"
									className={inputStyle}
									type="text"
									required
									value={formData.driversName || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Previous Cargo</label>
								<input
									onChange={handleChange}
									id="previousCargo"
									className={inputStyle}
									type="text"
									required
									value={formData.previousCargo || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>Driver's ID Identification</label>
								<input
									onChange={handleChange}
									id="driversIdentification"
									className={inputStyle}
									type="text"
									required
									value={formData.driversIdentification || ""}
								/>
							</div>
							<div>
								<label className={labelStyle}>To Load Cargo</label>
								<input
									onChange={handleChange}
									id="cargoToLoad"
									className={inputStyle}
									type="text"
									required
									value={formData.cargoToLoad || ""}
								/>
							</div>
						</div>

						{/* Dynamic Interactive Compartment Layout Matrix Tracker */}
						<div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
							<div className="flex justify-between items-center bg-gray-50 p-2 border-l-4 border-blue-800">
								<h3 className="text-xs font-bold uppercase tracking-wider">
									Trailer Tank Compartments
								</h3>
								<button
									type="button"
									onClick={handleAddCompartmentRow}
									className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase hover:bg-gray-800"
								>
									+ Add Compartment
								</button>
							</div>

							<div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
								{formData.compartmentCapacities.map((capacity, index) => (
									<div
										key={index}
										className="flex items-center gap-2 bg-gray-50 p-1 border border-b border-gray-200 rounded"
									>
										<div className="flex-1">
											{/* FIXED: Removed outer border envelope around inputs via borderless styles attribute mapping */}
											<input
												value={capacity}
												onChange={(e) =>
													handleCompartmentItemChange(index, e.target.value)
												}
												className={borderlessInputStyle}
												placeholder={`Compartment #${index + 1} Vol (Ltrs)`}
												type="number"
												required
											/>
										</div>
										{formData.compartmentCapacities.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveCompartmentRow(index)}
												className="text-red-500 hover:bg-red-50 font-bold px-2 text-xs"
											>
												X
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						{/* MOVED & INTEGRATED REAL-TIME AUTOMATIC TOTAL CALCULATIONS SECTION */}
						<div className="bg-gray-100 p-2 border-l-4 border-blue-800 mt-2">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Automated Capacity Accumulation Dashboard
							</h2>
						</div>
						<div className="bg-gray-50 p-4 border border-gray-200 rounded shadow-sm">
							<label className={labelStyle}>
								Grand Total Compartments Capacity (Litres Auto)
							</label>
							<input
								id="totalCompartmentCapacity"
								className={readOnlyStyle}
								type="number"
								readOnly
								value={formData.totalCompartmentCapacity}
							/>
						</div>
					</div>

					{/* RIGHT HALF: Complete Safety Survey Auditing Form Questionnaire Grid Sheet */}
					<div className="flex-1 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l-2 border-gray-200 lg:pl-10 pt-6 lg:pt-0">
						<div className="bg-gray-100 p-2 border-l-4 border-black">
							<h2 className="text-xs font-bold uppercase tracking-wider">
								Safety Checklist Questionnaire Verification
							</h2>
						</div>

						<div className="flex flex-col gap-0.5 max-h-[580px] overflow-y-auto pr-1 border border-gray-100 p-2 rounded bg-gray-50/50 shadow-inner">
							{checklistQuestions.map((question) => (
								<div key={question.id} className={checkboxContainerStyle}>
									<input
										onChange={handleChange}
										type="checkbox"
										id={question.id}
										className="w-4 h-4 cursor-pointer accent-black shrink-0"
										checked={formData[question.id]}
									/>
									<label
										htmlFor={question.id}
										className="text-[11px] cursor-pointer font-medium font-serif leading-tight text-gray-800 select-none"
									>
										{question.text}
									</label>
								</div>
							))}
						</div>

						{/* Document Legal Operational Structural Keys Metadata Footer Info */}
						<div className="p-3 bg-gray-100 text-[10px] text-gray-600 font-serif leading-relaxed uppercase border rounded">
							<p className="indent-0 font-semibold text-black mb-1">
								Ecosystem Abbreviations Key Reference:
							</p>
							<p className="indent-0">
								TIC : Tank Inspection Certificate | RTW : Road Tank Wagon
							</p>
							<p className="indent-0 border-t pt-1.5 mt-1.5 text-[9px] text-gray-500 font-sans tracking-tight">
								AUTHOR: QMR | APPROVED BY: GENERAL MANAGER | DOC. REF: IMSR, 08
								/ Veg26
							</p>
						</div>
					</div>
				</div>

				{/* Submission Action */}
				<footer className="mt-4 border-t pt-6 bg-transparent">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md tracking-widest text-xs font-serif"
					>
						{loading
							? "Processing Document Data Check..."
							: "Submit RTWS Safety Checklist"}
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
