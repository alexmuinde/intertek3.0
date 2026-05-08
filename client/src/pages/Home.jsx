import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Home() {
	const [allDocs, setAllDocs] = useState([]);
	const [filteredDocs, setFilteredDocs] = useState([]);
	const [loading, setLoading] = useState(true);
	const location = useLocation();

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				// 1. Fetch both collections from the new "geteveryones" endpoints
				const [wbRes, sofRes] = await Promise.all([
					fetch("/api/wheighBridge/geteveryones"),
					fetch("/api/statementOfFacts/geteveryones"),
				]);
				const wbData = await wbRes.json();
				const sofData = await sofRes.json();

				// 2. Combine them and add a 'docType' tag to distinguish them
				const combined = [
					...(Array.isArray(wbData)
						? wbData.map((d) => ({ ...d, docType: "WB" }))
						: []),
					...(Array.isArray(sofData)
						? sofData.map((d) => ({ ...d, docType: "SOF" }))
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

	// 3. Search logic updated to handle both truck numbers and vessel names
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTerm = urlParams.get("searchTerm")?.toLowerCase();

		if (searchTerm) {
			const filtered = allDocs.filter(
				(doc) =>
					doc.truckNumber?.toLowerCase().includes(searchTerm) ||
					doc.vessel?.toLowerCase().includes(searchTerm) ||
					doc.client?.toLowerCase().includes(searchTerm) ||
					doc.userRef?.username?.toLowerCase().includes(searchTerm),
			);
			setFilteredDocs(filtered);
		} else {
			setFilteredDocs(allDocs);
		}
	}, [location.search, allDocs]);

	if (loading)
		return (
			<p className="text-center p-10 font-serif">Loading Global Dashboard...</p>
		);

	return (
		<main className="p-4 max-w-6xl mx-auto font-serif">
			<header className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
				<div>
					<h1 className="text-2xl font-bold uppercase tracking-tighter">
						Global Dashboard
					</h1>
					<p className="text-xs text-gray-500 italic">
						Shared organizational activity
					</p>
				</div>
				<span className="text-sm italic text-gray-500">
					{filteredDocs.length} Total Records Found
				</span>
			</header>

			<div className="flex flex-col gap-4">
				{filteredDocs.length > 0 ? (
					filteredDocs.map((doc) => (
						<Link
							key={doc._id}
							to={
								doc.docType === "WB"
									? `/wheighBridge/${doc._id}`
									: `/statementOfFacts/${doc._id}`
							}
							className={`group block bg-white border-l-8 p-4 transition-all hover:shadow-lg active:scale-[0.99] border border-gray-200 ${
								doc.docType === "WB"
									? "border-l-green-600"
									: "border-l-blue-600"
							}`}
						>
							<div className="flex justify-between items-start">
								<div>
									<span
										className={`text-[10px] font-black uppercase px-2 py-0.5 rounded text-white mb-2 inline-block ${
											doc.docType === "WB" ? "bg-green-600" : "bg-blue-600"
										}`}
									>
										{doc.docType === "WB"
											? "WeighBridge"
											: "Statement of Facts"}
									</span>

									<h2 className="text-xl font-bold group-hover:text-blue-700 transition-colors">
										{doc.docType === "WB" ? doc.truckNumber : doc.vessel}
									</h2>

									{/* Created By Section with Avatar */}
									<div className="flex items-center gap-3 mt-2">
										<div className="flex items-center gap-2">
											{/* User Profile Picture */}
											<img
												src={doc.userRef?.avatar || "https://pixabay.com"}
												alt="creator"
												className="h-7 w-7 rounded-full object-cover border border-gray-200"
											/>
											<div className="flex flex-col">
												<span className="text-[10px] uppercase text-gray-400 font-bold leading-none">
													Created By
												</span>
												<span className="text-sm font-medium text-slate-700 italic">
													{doc.userRef?.username || "System User"}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="text-right">
									<span className="text-[10px] uppercase text-gray-400 font-bold block">
										Last Updated
									</span>
									<span className="text-sm font-medium">
										{new Date(doc.updatedAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</Link>
					))
				) : (
					<div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
						<p className="text-gray-400 italic">
							No matching records found in the system.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
