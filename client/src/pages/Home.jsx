// client/src/pages/Home.jsx (PART 1: INITIALIZATION & METADATA PLATFORM SCHEMAS)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHistory, FaPlus, FaArrowRight, FaFolderOpen, FaGlobe } from "react-icons/fa";

// Visual Token Styles synchronized from Sealing Report Component design language
const inputStyle =
  "w-full bg-[#f8f6f6] p-2 border-b border-black outline-none transition-all hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.19)] focus:border focus:shadow-[2px_2px_rgba(0,0,0,0.19)] text-xs font-serif font-medium";

const labelStyle =
  "block text-[11px] pl-1 mb-1 text-gray-700 font-bold tracking-wide uppercase font-serif";

// Fallback image string explicitly synchronized from your Mongoose User Model Schema
const defaultUserSchemaAvatar = "https://gstatic.com";

// Strict camelCase index synchronized with backend model naming to avoid route conflicts
const documentsIndex = [
  { id: "weighBridge", name: "Weigh Bridge Record Form", path: "/weighBridge", category: "Logistics" },
  { id: "statementOfFacts", name: "Statement of Facts Sheet", path: "/statementOfFacts", category: "Operations" },
  { id: "sealingReport", name: "Sealing Report Document", path: "/sealingReport", category: "Security" },
  { id: "vesselExperienceFactor", name: "Vessel Experience Factor Log", path: "/vesselExperienceFactor", category: "Marine" },
  { id: "vesselDischargeStatus", name: "Vessel Discharge Status Report", path: "/vesselDischargeStatus", category: "Marine" },
  { id: "shoreTankQuantityReport", name: "Shore Tank Quantity Report", path: "/shoreTankQuantityReport", category: "Storage" },
  { id: "shoreTankMeasurementData", name: "Shore Tank Measurement Data Sheet", path: "/shoreTankMeasurementData", category: "Storage" },
  { id: "shoreTankCleanlinessReport", name: "Shore Tank Cleanliness Report", path: "/shoreTankCleanlinessReport", category: "Storage" },
  { id: "shipsTanksUllageReport", name: "Ships Tanks Ullage Survey Report", path: "/shipsTanksUllageReport", category: "Marine" },
  { id: "rtwsSafetyChecklist", name: "RTWS Safety Audit Checklist", path: "/rtwsSafetyChecklist", category: "Safety" },
  { id: "receiptOfSealedSamples", name: "Receipt of Sealed Samples Matrix", path: "/receiptOfSealedSamples", category: "Security" },
  { id: "pumpingPressureLog", name: "Pumping Pressure Record Log", path: "/pumpingPressureLog", category: "Operations" },
  { id: "pipelineInspectionReport", name: "Pipeline Inspection Survey Report", path: "/pipelineInspectionReport", category: "Storage" },
  { id: "noticeOfApparentDiscrepancy", name: "Notice of Apparent Discrepancy Form", path: "/noticeOfApparentDiscrepancy", category: "Discrepancy" },
  { id: "letterOfProtestSlowRate", name: "Letter of Protest - Slow Pumping Rate", path: "/letterOfProtestSlowRate", category: "Protest" },
  { id: "letterOfProtestShoreFinalOutturnFigures", name: "Letter of Protest - Shore Final Outturn Figures", path: "/letterOfProtestShoreFinalOutturnFigures", category: "Protest" },
  { id: "letterOfProtestGeneral", name: "Letter of Protest - General Discrepancy", path: "/letterOfProtestGeneral", category: "Protest" },
  { id: "letterOfAssurance", name: "Letter of Assurance Protocol Document", path: "/letterOfAssurance", category: "Operations" },
  { id: "handOverReport", name: "Inspector Hand Over Shift Report", path: "/handOverReport", category: "Operations" },
  { id: "endOfPipelineSampleReport", name: "End of Pipeline Sample Analytics", path: "/endOfPipelineSampleReport", category: "Security" },
  { id: "dischargeProcedureSequence", name: "Discharge Procedure Sequence Matrix", path: "/dischargeProcedureSequence", category: "Operations" }
];
// client/src/pages/Home.jsx (PART 2: RESILIENT ACTIVITY LOGIC & DISPLAY RENDER)
export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [globalLiveFeed, setGlobalLiveFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [catalogSearch, setCatalogSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const aggregateGlobalDatabaseFeeds = async () => {
      try {
        setFeedLoading(true);
        
        // Active backend data collections to poll
        const targetGlobalEndpoints = ["sealingReport", "statementOfFacts", "weighBridge", "shoreTankQuantityReport"];
        
        // Wrapped in an individual catch-handler block to ensure any single 404/401 failure doesn't break the feed
        const fetchPromises = targetGlobalEndpoints.map(async (endpoint) => {
          try {
            const res = await fetch(`/api/${endpoint}/geteveryones`);
            if (!res.ok) {
              // Fallback to active personalized endpoint if user lacks global master credentials
              const alternativeRes = await fetch(`/api/${endpoint}/getall`);
              return alternativeRes.ok ? await alternativeRes.json() : [];
            }
            return await res.json();
          } catch (err) {
            console.warn(`Endpoint connection bypassed on schema target: ${endpoint}`, err);
            return [];
          }
        });
        
        const results = await Promise.all(fetchPromises);
        
        // Transform incoming data entries safely into uniform layout entities
		const compiledDocs = results.flatMap((dataset, index) => {
  if (!Array.isArray(dataset)) return [];
  const schemaKey = targetGlobalEndpoints[index];
  const schemaMeta = documentsIndex.find(d => d.id === schemaKey);
  
  return dataset.map(item => {
    // 1. Cleanly isolate the schema path string without any leading or trailing slashes
    const cleanPath = schemaMeta ? schemaMeta.path.replace(/^\/|\/$/g, "") : "";
    
    // 2. Safely extract the literal record ID from MongoDB
    const recordId = item._id;

    return {
      id: recordId,
      vesselName: item.vesselName || item.clientName || item.truckNumber || "Unspecified Target",
      portName: item.portName || item.location || "Onsite Field",
      updatedAt: new Date(item.updatedAt || item.createdAt || Date.now()),
      documentName: schemaMeta ? schemaMeta.name : "Inspector Document",
      
      // FIXED: Forces a strict absolute URL root path using a leading forward slash
      // This prevents the browser from appending new files to old IDs in the URL bar
      targetPath: cleanPath ? `/${cleanPath}/${recordId}` : "/",
      
      creator: item.userReference || { username: "System Automated", avatar: defaultUserSchemaAvatar }
    };
  });
});



        // Chronological live-feed rule: Sort by most recent updates first
        const orderedFeedLog = compiledDocs.sort((a, b) => b.updatedAt - a.updatedAt);
        setGlobalLiveFeed(orderedFeedLog);
      } catch (error) {
        console.error("Critical error inside dashboard data-stream pipeline:", error);
      } finally {
        setFeedLoading(false);
      }
    };

    aggregateGlobalDatabaseFeeds();
  }, []);

  const filteredCatalog = documentsIndex.filter(doc =>
    doc.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    doc.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <main className="p-4 max-w-7xl mx-auto font-serif bg-white text-gray-900 min-h-screen">
      
      {/* GLOBAL SYSTEM DASHBOARD TITLE FRAME BANNER */}
      <header className="mb-6 border-b-2 border-black pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
            <FaGlobe className="text-blue-800 text-sm animate-pulse" /> Live Activity Hub
          </h1>
          <p className="text-xs text-gray-600 mt-1 italic">
            Monitoring live modifications across all user registries. Active Session: @{currentUser?.username || "Guest Inspector"}.
          </p>
        </div>
        <div className="text-[10px] bg-black text-white px-3 py-1 font-bold tracking-wider uppercase border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
          Node Synced
        </div>
      </header>

      {/* DETAILED RESPONSIVE BRUTALIST RUNTIME DISPLAY SPLIT */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* RECENT USER ACTIVITY PIPELINE FEED PANEL Container */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-100 p-2 border-l-4 border-black flex items-center gap-2">
            <FaHistory className="text-xs text-black" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              System Wide Live Activity Streams (Lastly Updated First)
            </h2>
          </div>

          {feedLoading ? (
            <div className="p-4 bg-[#f8f6f6] border border-dashed border-black text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
              Hydrating public inspector document matrix streams...
            </div>
          ) : globalLiveFeed.length === 0 ? (
            <div className="p-6 bg-[#f8f6f6] border border-black text-center text-xs text-gray-500 font-bold uppercase tracking-wider italic">
              No entries recovered. Verify MongoDB cluster connectivity or create a report to seed the feed.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {globalLiveFeed.map((doc) => (
                <div 
                  key={doc.id}
                  className="border border-black p-3 bg-white hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={doc.creator?.avatar || defaultUserSchemaAvatar} 
                      alt="Inspector Avatar Signet" 
                      className="w-8 h-8 rounded-full border border-black object-cover shrink-0 shadow-sm mt-0.5"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.src = defaultUserSchemaAvatar; }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold bg-blue-800 text-white px-1.5 py-0.5 uppercase rounded-xs tracking-wider">
                          {doc.documentName}
                        </span>
                        <span className="text-[10px] text-gray-800 font-bold uppercase tracking-tight">
                          By @{doc.creator?.username || "unknown"}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wide mt-1">
                        Identity Ref: {doc.vesselName}
                      </h3>
                      <p className="text-[11px] text-gray-600">
                        Operational Port: {doc.portName} &bull; Activity Logged: {doc.updatedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link 
                    to={doc.targetPath} 
                    className="text-[10px] border border-black px-3 py-1.5 bg-white font-bold uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1 shrink-0 self-start sm:self-center"
                  >
                    Open File <FaArrowRight className="text-[8px]" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SYSTEM ACTIONS & FORM COMPONENT SELECTION ROW */}
        <div className="w-full lg:w-[420px] flex flex-col gap-4">
          <div className="bg-gray-100 p-2 border-l-4 border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaFolderOpen className="text-xs text-black" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Document Blueprints Catalog
              </h2>
            </div>
            <span className="text-[9px] font-mono bg-black text-white px-1.5 py-0.5 font-bold">
              {filteredCatalog.length} SCHEMAS
            </span>
          </div>

          <div>
            <label className={labelStyle}>Quick Component Catalog Filter</label>
            <input 
              type="text" 
              className={inputStyle}
              placeholder="Search blueprints by category or naming scheme..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1 border border-gray-200 p-2 bg-gray-50/50">
            {filteredCatalog.map((doc) => (
              <div 
                key={doc.id}
                className="group border border-gray-300 bg-white p-2.5 hover:border-black transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-0.5 truncate">
                  <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase font-mono">
                    {doc.category}
                  </span>
                  <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide truncate group-hover:text-black transition-colors">
                    {doc.name}
                  </h4>
                </div>
                <Link
                  to={doc.path}
                  className="bg-gray-100 hover:bg-black hover:text-white p-1.5 border border-gray-300 group-hover:border-black transition-all text-gray-700 text-[10px]"
                >
                  <FaPlus />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
