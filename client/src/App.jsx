import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import About from "./pages/about";
import Profile from "./pages/profile";
import Header from "./components/header";
import PrivateRoute from "./components/PrivateRoute";
import WheighBridge from "./pages/wheighBridge";
import StatementOfFacts from "./pages/statementOfFacts";
import SealingReport from "./pages/sealingReport";
import VesselExperienceFactor from "./pages/vesselExperienceFactor";
import VesselDischargeStatus from "./pages/vesselDischargeStatus";
import ShoreTankQuantityReport from "./pages/shoreTankQuantityReport";
import ShoreTankMeasurementData from "./pages/shoreTankMeasurementData";
import ShoreTankCleanlinessReport from "./pages/shoreTankCleanlinessReport";
import ShipsTanksUllageReport from "./pages/shipsTanksUllageReport";
import RtwsSafetyChecklist from "./pages/rtwsSafetyChecklist";
import ReceiptOfSealedSamples from "./pages/receiptOfSealedSamples";
import PumpingPressureLog from "./pages/pumpingPressureLog";
import PipelineInspectionReport from "./pages/pipelineInspectionReport";
import NoticeOfApparentDiscrepancy from "./pages/noticeOfApparentDiscrepancy";
import LetterOfProtestSlowRate from "./pages/letterOfProtestSlowRate";
import LetterOfProtestShoreFinalOutturnFigures from "./pages/letterOfProtestShoreFinalOutturnFigures";
import LetterOfProtestGeneral from "./pages/letterOfProtestGeneral";
import LetterOfAssurance from "./pages/letterOfAssurance";
import HandOverReport from "./pages/handOverReport";
import EndOfPipelineSampleReport from "./pages/endOfPipelineSampleReport";
import DischargeProcedureSequence from "./pages/dischargeProcedureSequence";

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signIn" element={<SignIn />} />
				<Route path="/signUp" element={<SignUp />} />
				<Route path="/about" element={<About />} />
				<Route element={<PrivateRoute />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/wheighBridge/:id?" element={<WheighBridge />} />
					<Route path="/statementOfFacts/:id?" element={<StatementOfFacts />} />
					<Route path="/sealingReport/:id?" element={<SealingReport />} />
					<Route
						path="/vesselExperienceFactor/:id?"
						element={<VesselExperienceFactor />}
					/>
					<Route
						path="/vesselDischargeStatus/:id?"
						element={<VesselDischargeStatus />}
					/>
					<Route
						path="/shoreTankQuantityReport/:id?"
						element={<ShoreTankQuantityReport />}
					/>
					<Route
						path="/shoreTankMeasurementData/:id?"
						element={<ShoreTankMeasurementData />}
					/>
					<Route
						path="/shoreTankCleanlinessReport/:id?"
						element={<ShoreTankCleanlinessReport />}
					/>
					<Route
						path="/shipsTanksUllageReport/:id?"
						element={<ShipsTanksUllageReport />}
					/>
					<Route
						path="/rtwsSafetyChecklist/:id?"
						element={<RtwsSafetyChecklist />}
					/>
					<Route
						path="/receiptOfSealedSamples/:id?"
						element={<ReceiptOfSealedSamples />}
					/>
					<Route
						path="/pumpingPressureLog/:id?"
						element={<PumpingPressureLog />}
					/>
					<Route
						path="/pipelineInspectionReport/:id?"
						element={<PipelineInspectionReport />}
					/>
					<Route
						path="/noticeOfApparentDiscrepancy/:id?"
						element={<NoticeOfApparentDiscrepancy />}
					/>
					<Route
						path="/letterOfProtestSlowRate/:id?"
						element={<LetterOfProtestSlowRate />}
					/>
					<Route
						path="/letterOfProtestShoreFinalOutturnFigures/:id?"
						element={<LetterOfProtestShoreFinalOutturnFigures />}
					/>
					<Route
						path="/letterOfProtestGeneral/:id?"
						element={<LetterOfProtestGeneral />}
					/>
					<Route
						path="/letterOfAssurance/:id?"
						element={<LetterOfAssurance />}
					/>
					<Route path="/handOverReport/:id?" element={<HandOverReport />} />
					<Route
						path="/endOfPipelineSampleReport/:id?"
						element={<EndOfPipelineSampleReport />}
					/>
					<Route
						path="/dischargeProcedureSequence/:id?"
						element={<DischargeProcedureSequence />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
