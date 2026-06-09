// client/src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Consolidated Style Classes from Sealing Report Component
const inputStyle =
  "w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-xs font-serif font-medium";

// Synchronized Index using strict camelCase paths matching the backend API structures
const documentsIndex = [
  { id: "weighBridge", name: "Weigh Bridge Record Form", path: "/weighBridge" },
  { id: "statementOfFacts", name: "Statement of Facts Sheet", path: "/statementOfFacts" },
  { id: "sealingReport", name: "Sealing Report Document", path: "/sealingReport" },
  { id: "vesselExperienceFactor", name: "Vessel Experience Factor Log", path: "/vesselExperienceFactor" },
  { id: "vesselDischargeStatus", name: "Vessel Discharge Status Report", path: "/vesselDischargeStatus" },
  { id: "shoreTankQuantityReport", name: "Shore Tank Quantity Report", path: "/shoreTankQuantityReport" },
  { id: "shoreTankMeasurementData", name: "Shore Tank Measurement Data Sheet", path: "/shoreTankMeasurementData" },
  { id: "shoreTankCleanlinessReport", name: "Shore Tank Cleanliness Report", path: "/shoreTankCleanlinessReport" },
  { id: "shipsTanksUllageReport", name: "Ships Tanks Ullage Survey Report", path: "/shipsTanksUllageReport" },
  { id: "rtwsSafetyChecklist", name: "RTWS Safety Audit Checklist", path: "/rtwsSafetyChecklist" },
  { id: "receiptOfSealedSamples", name: "Receipt of Sealed Samples Matrix", path: "/receiptOfSealedSamples" },
  { id: "pumpingPressureLog", name: "Pumping Pressure Record Log", path: "/pumpingPressureLog" },
  { id: "pipelineInspectionReport", name: "Pipeline Inspection Survey Report", path: "/pipelineInspectionReport" },
  { id: "noticeOfApparentDiscrepancy", name: "Notice of Apparent Discrepancy Form", path: "/noticeOfApparentDiscrepancy" },
  { id: "letterOfProtestSlowRate", name: "Letter of Protest - Slow Pumping Rate", path: "/letterOfProtestSlowRate" },
  { id: "letterOfProtestShoreFinalOutturnFigures", name: "Letter of Protest - Shore Final Outturn Figures", path: "/letterOfProtestShoreFinalOutturnFigures" },
  { id: "letterOfProtestGeneral", name: "Letter of Protest - General Discrepancy", path: "/letter-of-protest-general" },
  { id: "letterOfAssurance", name: "Letter of Assurance Protocol Document", path: "/letterOfAssurance" },
  { id: "handOverReport", name: "Inspector Hand Over Shift Report", path: "/handOverReport" },
  { id: "endOfPipelineSampleReport", name: "End of Pipeline Sample Analytics", path: "/endOfPipelineSampleReport" },
  { id: "dischargeProcedureSequence", name: "Discharge Procedure Sequence Matrix", path: "/dischargeProcedureSequence" }
];

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Evaluate query strings locally on standard user key inputs
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const internalMatch = documentsIndex.filter((documentItem) =>
      documentItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documentItem.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(internalMatch);
  }, [searchTerm]);

  // Cleanly dismiss overlay if viewport selection targets background space
  useEffect(() => {
    function handleOutsideInteraction(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideInteraction);
    return () => document.removeEventListener("mousedown", handleOutsideInteraction);
  }, []);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    // Preserves original dashboard global query filter routing behavior
    navigate(`/?searchTerm=${searchTerm}`);
  };

  const handleDocumentNavigation = (targetPath) => {
    setSearchTerm("");
    setShowDropdown(false);
    navigate(targetPath);
  };

  return (
    <header className="w-full bg-white border-b-2 border-black font-serif text-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO CORPORATE BRAND MARK */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src="/Intertek_logo.svg.png" 
            alt="Intertek Logo" 
            className="h-8 w-auto object-contain max-w-[140px] transition-transform group-hover:scale-102"
          />
          
        </Link>

        {/* COMPREHENSIVE CONTROL DIRECTORY INPUT ROW */}
        <div ref={dropdownRef} className="flex-1 max-w-xl relative mx-2">
          <form onSubmit={handleFormSubmission} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search Client, Truck, or Inspector Document file name..."
              className={`${inputStyle} pr-8`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2.5 p-1 text-gray-600 hover:text-black transition-colors"
              aria-label="Submit Form Filter Search"
            >
              <FaSearch className="text-xs" />
            </button>
          </form>

          {/* AUTOCOMPLETE LIVE LOOKUP INDEX PANEL */}
          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] max-h-72 overflow-y-auto z-50">
              <li className="bg-gray-100 px-3 py-2 border-b border-black text-[9px] font-bold text-gray-500 tracking-wider uppercase">
                Matching Inspector Workspace Files ({searchResults.length})
              </li>
              {searchResults.map((doc) => (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => handleDocumentNavigation(doc.path)}
                    className="w-full text-left px-4 py-2.5 text-[11px] font-medium hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-all uppercase tracking-wide"
                  >
                    <span className="truncate pr-4 text-gray-800 font-semibold">{doc.name}</span>
                    
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* FALLBACK SYSTEM DISCOVERY BANNER */}
          {showDropdown && searchTerm.trim() !== "" && searchResults.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#f8f6f6] border border-black p-3 text-[10px] text-center text-gray-600 font-bold tracking-wide uppercase">
              No matching backend document file schemas isolated
            </div>
          )}
        </div>

        {/* WORKSPACE OPERATIONS LINKS */}
        <nav className="flex items-center gap-5 text-[11px] font-bold tracking-wide uppercase shrink-0">
          <Link to="/" className="hover:text-blue-800 transition-all">
            Home
          </Link>
          <Link to="/about" className="hidden md:inline hover:text-blue-800 transition-all">
            About
          </Link>
          <Link to="/profile" className="flex items-center">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile Record Avatar"
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border border-black object-cover shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:scale-105 transition-all"
              />
            ) : (
              <span className="border border-black px-3 py-1.5 bg-black text-white hover:bg-white hover:text-black transition-all text-[10px]">
                Sign In
              </span>
            )}
          </Link>
        </nav>

      </div>
    </header>
  );
}
