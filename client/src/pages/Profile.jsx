// client/src/pages/Profile.jsx (PART 1: INITIALIZATION & UPLOAD PIPELINE)
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaCog, FaChevronUp, FaHistory, FaFolderOpen, FaArrowRight } from "react-icons/fa";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice.js";

// Visual Token Styles synchronized from Sealing Report Component design language
const inputStyle =
  "w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-xs font-serif font-medium";

const labelStyle =
  "block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

const defaultUserSchemaAvatar = "https://gstatic.com";

// Strict camelCase index synchronized with backend endpoints
const documentsIndex = [
  { id: "weighBridge", name: "Weigh Bridge Record Form", path: "/weighBridge" },
  { id: "statementOfFacts", name: "Statement of Facts Sheet", path: "/statementOfFacts" },
  { id: "sealingReport", name: "Sealing Report Document", path: "/sealingReport" },
  { id: "vesselExperienceFactor", name: "Vessel Experience Factor", path: "/vesselExperienceFactor" },
  { id: "vesselDischargeStatus", name: "Vessel Discharge Status", path: "/vesselDischargeStatus" },
  { id: "shoreTankQuantityReport", name: "Shore Tank Quantity Report", path: "/shoreTankQuantityReport" },
  { id: "shoreTankMeasurementData", name: "Shore Tank Measurement Data", path: "/shoreTankMeasurementData" },
  { id: "shoreTankCleanlinessReport", name: "Shore Tank Cleanliness Report", path: "/shoreTankCleanlinessReport" },
  { id: "shipsTanksUllageReport", name: "Ships Tanks Ullage Report", path: "/shipsTanksUllageReport" },
  { id: "rtwsSafetyChecklist", name: "RTWS Safety Checklist", path: "/rtwsSafetyChecklist" },
  { id: "receiptOfSealedSamples", name: "Receipt of Sealed Samples", path: "/receiptOfSealedSamples" },
  { id: "pumpingPressureLog", name: "Pumping Pressure Log", path: "/pumpingPressureLog" },
  { id: "pipelineInspectionReport", name: "Pipeline Inspection Report", path: "/pipelineInspectionReport" },
  { id: "noticeOfApparentDiscrepancy", name: "Notice of Apparent Discrepancy", path: "/noticeOfApparentDiscrepancy" },
  { id: "letterOfProtestSlowRate", name: "Letter of Protest - Slow Rate", path: "/letterOfProtestSlowRate" },
  { id: "letterOfProtestShoreFinalOutturnFigures", name: "Letter of Protest - Shore Final Outturn Figures", path: "/letterOfProtestShoreFinalOutturnFigures" },
  { id: "letterOfProtestGeneral", name: "Letter of Protest - General", path: "/letterOfProtestGeneral" },
  { id: "letterOfAssurance", name: "Letter of Assurance", path: "/letterOfAssurance" },
  { id: "handOverReport", name: "Hand Over Report", path: "/handOverReport" },
  { id: "endOfPipelineSampleReport", name: "End of Pipeline Sample Report", path: "/endOfPipelineSampleReport" },
  { id: "dischargeProcedureSequence", name: "Discharge Procedure Sequence", path: "/dischargeProcedureSequence" }
];


export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Consolidated operational activity matrix storage
  const [userCreatedDocs, setUserCreatedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    if (file) handleFileUpload(file[0]);
  }, [file]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleFileUpload = (file) => {
    const cloudName = "dnxmcdha2";
    const uploadPreset = "intertek";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.upload.addEventListener("progress", (e) =>
      setFilePerc(Math.round((e.loaded * 100.0) / e.total)),
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setFormData({
          ...formData,
          avatar: JSON.parse(xhr.responseText).secure_url,
        });
        setFileUploadError(false);
      } else if (xhr.readyState === 4) setFileUploadError(true);
    };
    fd.append("upload_preset", uploadPreset);
    fd.append("file", file);
    xhr.send(fd);
  };
// client/src/pages/Profile.jsx (PART 2: USER LOG EVALUATION & CORE RENDER ENGINE)

  // Queries all user personal record endpoints and aggregates them chronologically (Newest At Top)
  useEffect(() => {
    const fetchUserPersonalDocumentsLog = async () => {
      if (!currentUser?._id) return;
      try {
        setLoadingDocs(true);
        const targetEndpoints = [
  "weighBridge",
  "statementOfFacts",
  "sealingReport",
  "vesselExperienceFactor",
  "vesselDischargeStatus",
  "shoreTankQuantityReport",
  "shoreTankMeasurementData",
  "shoreTankCleanlinessReport",
  "shipsTanksUllageReport",
  "rtwsSafetyChecklist",
  "receiptOfSealedSamples",
  "pumpingPressureLog",
  "pipelineInspectionReport",
  "noticeOfApparentDiscrepancy",
  "letterOfProtestSlowRate",
  "letterOfProtestShoreFinalOutturnFigures",
  "letterOfProtestGeneral",
  "letterOfAssurance",
  "handOverReport",
  "endOfPipelineSampleReport",
  "dischargeProcedureSequence"
];

        const fetchPromises = targetEndpoints.map(endpoint =>
          fetch(`/api/${endpoint}/getall`).then(res => res.ok ? res.json() : [])
        );
        
        const results = await Promise.all(fetchPromises);
        
        const compiledUserDocs = results.flatMap((dataset, index) => {
          if (!Array.isArray(dataset)) return [];
          const schemaKey = targetEndpoints[index];
          const schemaMeta = documentsIndex.find(d => d.id === schemaKey);
          
          return dataset.map(item => ({
            id: item._id,
            vesselName: item.vesselName || item.clientName || item.truckNumber || "Unspecified Record ID",
            portName: item.portName || item.location || "Onsite Field",
            updatedAt: new Date(item.updatedAt || item.createdAt || Date.now()),
            documentName: schemaMeta ? schemaMeta.name : "Inspector Report Form",
            targetPath: schemaMeta ? `/${schemaMeta.path.replace(/^\//, "")}/${item._id}` : "/"
          }));
        });

        // LIVE FEED SORT RULE: Place the most recently updated or created document at the absolute top
        const sortedLog = compiledUserDocs.sort((a, b) => b.updatedAt - a.updatedAt);
        setUserCreatedDocs(sortedLog);
      } catch (err) {
        console.error("Failed parsing personalized profile database records:", err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchUserPersonalDocumentsLog();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        return dispatch(updateUserFailure(data.message));
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFormData({});
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900 min-h-screen">
      
      {/* HEADER SECTION IDENTIFIER */}
      <header className="mb-6 border-b-2 border-black pb-3">
        <h1 className="text-lg font-bold uppercase tracking-widest">
          Inspector Profile Registry Matrix
        </h1>
      </header>

      {/* TWO-COLUMN LAYOUT ALIGNMENT */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COMPONENT COLUMN: INTERACTIVE PROFILE SETTINGS INPUT MODULE */}
        <div
          className={`transition-all duration-300 ease-in-out border border-black p-4 bg-white shadow-sm
          ${isExpanded ? "w-full" : "w-full lg:w-1/3 bg-[#f8f6f6] lg:bg-white"}`}
        >
          {/* Mobile Collapsed Badge Option */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center justify-between cursor-pointer lg:hidden ${isExpanded ? "hidden" : "flex"}`}
          >
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || defaultUserSchemaAvatar}
                className="h-10 w-10 rounded-full object-cover border border-black"
                alt="Mini Profile Icon"
                onError={(e) => { e.target.src = defaultUserSchemaAvatar; }}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">@{currentUser.username}</p>
                <p className="text-[9px] text-blue-800 font-bold uppercase tracking-tight">Edit Identity Parameters</p>
              </div>
            </div>
            <FaCog size={14} className="text-gray-900" />
          </div>

          {/* Form Fields Expansion Panel */}
          <div className={`transition-all duration-300 ${isExpanded ? "opacity-100 block" : "hidden lg:block"}`}>
            <div className="flex justify-between items-center mb-4 border-b border-black pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Profile Parameters Configuration
              </h2>
              
			<button onClick={() => setIsExpanded(false)} className="lg:hidden p-1 text-gray-600 hover:text-black">
  				<FaChevronUp size={16} /> {/* Updated icon component call token */}
			</button>

            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setFile(e.target.files)}
              />
              <div className="flex flex-col items-center gap-2">
                <img
                  onClick={() => fileRef.current.click()}
                  src={formData.avatar || currentUser.avatar || defaultUserSchemaAvatar}
                  alt="Inspector Avatar Signet"
                  className="rounded-full h-20 w-20 cursor-pointer border border-black object-cover shadow-sm hover:scale-102 transition-transform"
                  onError={(e) => { e.target.src = defaultUserSchemaAvatar; }}
                />
                
                {/* Cloudinary Upload Status Micro-Text Bar */}
                <div className="text-[9px] font-bold uppercase tracking-wide text-center">
                  {fileUploadError ? (
                    <span className="text-red-600">Cloudinary processing failure</span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-blue-800">Uploading: {filePerc}%</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green-700">Image upload synced</span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Inspector Username</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    id="username"
                    defaultValue={currentUser.username}
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>Corporate Email Address</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    id="email"
                    defaultValue={currentUser.email}
                    className={inputStyle}
                    required
                  />
                </div>
                
                <button
                  disabled={loading}
                  className="w-full bg-black text-white p-2 text-xs font-bold uppercase hover:bg-gray-800 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
                >
                  {loading ? "Syncing Credentials..." : "Commit Parameter Updates"}
                </button>
              </div>
            </form>

            {/* Micro Alerts System Feed */}
            {updateSuccess && (
              <p className="mt-3 text-[10px] bg-green-50 border border-green-600 text-green-800 text-center font-bold p-1 uppercase tracking-wide">
                Account modifications verified and committed.
              </p>
            )}
            {error && (
              <p className="mt-3 text-[10px] bg-red-50 border border-red-600 text-red-800 text-center font-bold p-1 uppercase tracking-wide">
                Registry Error: {error}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: PERSONAL LIVE LOG TRACKER FOR USER RECORDS */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="bg-gray-100 p-2 border-l-4 border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaFolderOpen className="text-xs text-black" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                My Document Activity Logs (Lastly Updated At Top)
              </h2>
            </div>
            <span className="text-[9px] font-mono bg-black text-white px-1.5 py-0.5 font-bold">
              {userCreatedDocs.length} ENTRIES
            </span>
          </div>

          {loadingDocs ? (
            <div className="p-4 bg-[#f8f6f6] border border-dashed border-black text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
              Querying chronological user data registry files...
            </div>
          ) : userCreatedDocs.length === 0 ? (
            <div className="p-6 bg-[#f8f6f6] border border-black text-center text-xs text-gray-500 font-bold uppercase tracking-wider italic">
              You have not created or compiled any inspector documents yet under this signature card.
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {userCreatedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-black p-3 bg-white hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold bg-blue-800 text-white px-2 py-0.5 w-max uppercase tracking-wider rounded-xs">
                      {doc.documentName}
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wide mt-1.5">
                      Identity Ref: {doc.vesselName}
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Operational Location: {doc.portName} &bull; Last Activity: {doc.updatedAt.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={doc.targetPath}
                    className="text-[10px] border border-black px-3 py-1.5 bg-white font-bold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1 shrink-0 self-start sm:self-center shadow-sm"
                  >
                    Manage File <FaArrowRight className="text-[8px]" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
