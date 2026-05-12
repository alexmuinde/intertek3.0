import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
	const [allDocs, setAllDocs] = useState([]);
	const [filteredDocs, setFilteredDocs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState("ALL"); // Track active filter
	const location = useLocation();

	const { currentUser } = useSelector((state) => state.user); // Get current user
	const [myReportsOnly, setMyReportsOnly] = useState(false);

	const docConfig = {
		WB: {
			label: "WeighBridge",
			color: "border-l-green-600",
			badge: "bg-green-600",
			path: "wheighBridge",
		},
		SOF: {
			label: "Statement of Facts",
			color: "border-l-blue-600",
			badge: "bg-blue-600",
			path: "statementOfFacts",
		},
		SR: {
			label: "Sealing Report",
			color: "border-l-red-600",
			badge: "bg-red-600",
			path: "sealingReport",
		},
		STQR: {
			label: "Shore Tank Quantity",
			color: "border-l-amber-600",
			badge: "bg-amber-600",
			path: "shoreTankQuantityReport",
		},
		VDS: {
			label: "Vessel Discharge Status",
			color: "border-l-purple-600",
			badge: "bg-purple-600",
			path: "vesselDischargeStatus",
		},
		VEF: {
			label: "Vessel Experience Factor",
			color: "border-l-teal-600",
			badge: "bg-teal-600",
			path: "vesselExperienceFactor",
		},
	};

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				const [wb, sof, sr, stqr, vds, vef] = await Promise.all([
					fetch("/api/wheighBridge/geteveryones").then((res) => res.json()),
					fetch("/api/statementOfFacts/geteveryones").then((res) => res.json()),
					fetch("/api/sealingReport/geteveryones").then((res) => res.json()),
					fetch("/api/shoreTankQuantityReport/geteveryones").then((res) =>
						res.json(),
					),
					fetch("/api/vesselDischargeStatus/geteveryones").then((res) =>
						res.json(),
					),
					fetch("/api/vesselExperienceFactor/geteveryones").then((res) =>
						res.json(),
					),
				]);

				const combined = [
					...(Array.isArray(wb)
						? wb.map((d) => ({ ...d, docType: "WB" }))
						: []),
					...(Array.isArray(sof)
						? sof.map((d) => ({ ...d, docType: "SOF" }))
						: []),
					...(Array.isArray(sr)
						? sr.map((d) => ({ ...d, docType: "SR" }))
						: []),
					...(Array.isArray(stqr)
						? stqr.map((d) => ({ ...d, docType: "STQR" }))
						: []),
					...(Array.isArray(vds)
						? vds.map((d) => ({ ...d, docType: "VDS" }))
						: []),
					...(Array.isArray(vef)
						? vef.map((d) => ({ ...d, docType: "VEF" }))
						: []),
				].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

				setAllDocs(combined);
				setFilteredDocs(combined);
				setLoading(false);
			} catch (err) {
				console.error("Error loading global dashboard:", err);
				setLoading(false);
			}
		};
		fetchAllData();
	}, []);

	// Combined Search and Category Filter Logic
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTerm = urlParams.get("searchTerm")?.toLowerCase();

		let results = allDocs;

		// 1. Filter by Document Type (Existing)
		if (activeFilter !== "ALL") {
			results = results.filter((doc) => doc.docType === activeFilter);
		}

		// 2. NEW: Filter by Ownership (My Reports)
		if (myReportsOnly && currentUser) {
			results = results.filter((doc) => doc.userRef?._id === currentUser._id);
		}

		// 3. Filter by Search Term (Existing)
		if (searchTerm) {
			results = results.filter(
				(doc) =>
					doc.truckNumber?.toLowerCase().includes(searchTerm) ||
					doc.vessel?.toLowerCase().includes(searchTerm) ||
					doc.userRef?.username?.toLowerCase().includes(searchTerm),
			);
		}

		setFilteredDocs(results);
	}, [location.search, allDocs, activeFilter, myReportsOnly, currentUser]);

	if (loading)
		return (
			<p className="text-center p-10 font-serif italic text-gray-500">
				Syncing organizational records...
			</p>
		);

	const exportToCSV = () => {
		if (filteredDocs.length === 0) return alert("No records to export");

		// 1. Define the headers for the Excel file
		const headers = [
			"Document Type",
			"Vessel/Truck",
			"Surveyor",
			"Last Updated",
			"ID",
		];

		// 2. Map the filtered data into rows
		const rows = filteredDocs.map((doc) => [
			docConfig[doc.docType].label,
			doc.docType === "WB" ? doc.truckNumber : doc.vessel || "N/A",
			doc.userRef?.username || "System User",
			new Date(doc.updatedAt).toLocaleDateString("en-GB"),
			doc._id,
		]);

		// 3. Combine headers and rows with commas and new lines
		const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

		// 4. Create a download link and trigger it
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`Intertek_Report_${new Date().toISOString().split("T")[0]}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return (
		<main className="p-4 max-w-6xl mx-auto font-serif">
			<header className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
				<div>
					<h1 className="text-2xl font-bold uppercase tracking-tighter text-slate-800">
						Global Dashboard
					</h1>
					<p className="text-[10px] text-gray-500 italic uppercase font-bold tracking-widest">
						Intertek Operations Control
					</p>
				</div>

				<div className="flex items-center gap-4">
					<button
						onClick={exportToCSV}
						className="flex items-center gap-2 bg-green-700 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-green-800 transition-all shadow-sm"
					>
						<svg
							xmlns="http://w3.org"
							className="h-3 w-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						Export CSV
					</button>

					<span className="text-[10px] font-bold uppercase bg-black text-white px-3 py-1 rounded">
						{filteredDocs.length} Records
					</span>
				</div>
			</header>

			{/* --- FILTER SECTION --- */}
			<div className="mb-8 space-y-4">
				{/* ROW 1: PRIMARY TOGGLES */}
				<div className="flex flex-wrap items-center gap-3">
					{currentUser && (
						<button
							onClick={() => setMyReportsOnly(!myReportsOnly)}
							className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase transition-all border ${
								myReportsOnly
									? "bg-blue-50 text-blue-700 border-blue-600 shadow-sm"
									: "bg-white text-gray-500 border-gray-200 hover:border-blue-600 hover:text-blue-600"
							}`}
						>
							<div
								className={`h-2 w-2 rounded-full ${myReportsOnly ? "bg-blue-600 animate-pulse" : "bg-gray-300"}`}
							></div>
							{myReportsOnly
								? "Viewing My Contributions"
								: "Show My Reports Only"}
						</button>
					)}

					<button
						onClick={() => {
							setActiveFilter("ALL");
							setMyReportsOnly(false);
						}}
						className={`px-4 py-2 text-[10px] font-bold uppercase border transition-all ${
							activeFilter === "ALL" && !myReportsOnly
								? "bg-black text-white border-black shadow-sm"
								: "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
						}`}
					>
						All Organizational Activity
					</button>
				</div>

				{/* ROW 2: DOCUMENT CATEGORIES (SLIDING) */}
				<div className="relative border-t border-gray-200 pt-4">
					<div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x pb-1">
						{Object.keys(docConfig).map((type) => (
							<button
								key={type}
								onClick={() => {
									setActiveFilter(type);
									// Optional: if you want category clicks to turn off "My Reports",
									// uncomment the line below:
									// setMyReportsOnly(false);
								}}
								className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-bold uppercase border transition-all snap-start ${
									activeFilter === type
										? `${docConfig[type].badge} text-white border-transparent shadow-sm`
										: "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
								}`}
							>
								{docConfig[type].label}
							</button>
						))}
					</div>
					{/* Subtle Fade Effect for the sliding edge */}
					<div className="absolute right-0 top-4 h-8 w-12 bg-gradient-to-l from-[rgb(240,238,238)] to-transparent pointer-events-none lg:hidden"></div>
				</div>
			</div>

			{/* --- DOCUMENTS LIST --- */}
			<div className="flex flex-col gap-4">
				{filteredDocs.length > 0 ? (
					filteredDocs.map((doc) => {
						const config = docConfig[doc.docType];
						return (
							<Link
								key={doc._id}
								to={`/${config.path}/${doc._id}`}
								className={`group block bg-white border border-gray-200 border-l-8 p-4 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] ${config.color}`}
							>
								<div className="flex justify-between items-start">
									<div>
										<span
											className={`text-[9px] font-black uppercase px-2 py-0.5 rounded text-white mb-2 inline-block ${config.badge}`}
										>
											{config.label}
										</span>

										<h2 className="text-lg font-bold group-hover:text-blue-700 transition-colors uppercase tracking-tight">
											{doc.docType === "WB"
												? doc.truckNumber
												: doc.vessel || "Pending Vessel Name"}
										</h2>

										<div className="flex items-center gap-3 mt-3">
											<div className="flex items-center gap-2">
												<img
													src={doc.userRef?.avatar || "https://pixabay.com"}
													alt="creator"
													className="h-6 w-6 rounded-full object-cover border border-gray-200 shadow-sm"
												/>
												<div className="flex flex-col">
													<span className="text-[9px] uppercase text-gray-400 font-bold leading-none">
														Surveyor
													</span>
													<span className="text-xs font-medium text-slate-700 italic">
														{doc.userRef?.username || "System Inspector"}
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className="text-right">
										<span className="text-[9px] uppercase text-gray-400 font-bold block">
											Status Date
										</span>
										<span className="text-xs font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 font-sans">
											{new Date(doc.updatedAt).toLocaleDateString("en-GB")}
										</span>
									</div>
								</div>
							</Link>
						);
					})
				) : (
					<div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
						<p className="text-gray-400 italic text-sm">
							No matching{" "}
							{activeFilter !== "ALL"
								? docConfig[activeFilter].label
								: "records"}{" "}
							found in organizational history.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
