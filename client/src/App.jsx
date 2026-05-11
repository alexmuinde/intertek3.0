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
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
