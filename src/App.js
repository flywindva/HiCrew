import './App.css';
import Navbar from "./components/navbar/navbar";
import {Home} from "./pages/home/home";
import Footer from "./components/footer/footer";
import {Route, Routes} from "react-router-dom";
import {PrivacyPolicy} from "./pages/privacy-policy/privacy-policy";
import {CookiePolicy} from "./pages/cookies/cookies";
import {CookieBanner} from "./components/cookie-banner/cookie-banner";
import {Register} from "./pages/register/register";
import {Login} from "./pages/login/login";
import {Forgot} from "./pages/forgot/forgot";
import {Rules} from "./pages/rules/rules";
import {Central} from "./pages/central/central";
import {PilotList} from "./pages/list/list";
import {Events} from "./pages/events/events";
import {Notams} from "./pages/notams/notams";
import {Tours} from "./pages/tours/tours";
import ProtectedRoute from "./components/check-auth/protected";
import {Profile} from "./pages/profile/profile";
import {PublicProfile} from "./pages/public-profile/public-profile";
import {Manager} from "./pages/manager/manager";
import {Acars} from "./pages/acars/acars";
import {AdminZone} from "./pages/admin/admin-zone";
import {Lang} from "./pages/lang/lang";
import {ChangePosition} from "./pages/changes/change-position";
import {ChangeAirline} from "./pages/changes/change-airline";
import {ChangeHub} from "./pages/changes/change-hub";
import {DeleteAccount} from "./pages/changes/delete-account";
import {Archive} from "./pages/archive/archive";
import {ResetPassword} from "./pages/reset-password/reset";
import {AuthContext} from "./components/auth-context/auth";
import {useContext, useEffect, useState} from "react";
import CallsignPrompt from "./components/callsign-prompt/callsign-prompt";
import {Stats} from "./pages/stats/stats";
import {globalVariables} from "./config";

function App() {
    const { isAuthenticated, pilot } = useContext(AuthContext);
    const [showCallsignPrompt, setShowCallsignPrompt] = useState(false);

    useEffect(() => {
        document.title = globalVariables.PAGE_TITLE;

        if (isAuthenticated && pilot && !pilot.callsign) {
            setShowCallsignPrompt(true);
        } else {
            setShowCallsignPrompt(false);
        }
    }, [isAuthenticated, pilot]);

    return (
        <div className="app">
            <Navbar/>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/rules"} element={<Rules />} />
                <Route path={"/lang"} element={<Lang />} />

                <Route path={"/stats"} element={<Stats />} />

                <Route path={"/central"} element={<Central />} />

                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/forgot-password"} element={<Forgot />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path={"/privacy-policy"} element={<PrivacyPolicy />} />
                <Route path={"/cookie-policy"} element={<CookiePolicy />} />

                <Route path={"/pilots"} element={<PilotList />} />
                <Route path={"/events"} element={<Events />} />
                <Route path={"/notams"} element={<Notams />} />

                <Route path={"/tours"} element={
                    <ProtectedRoute>
                        <Tours />
                    </ProtectedRoute>
                } />

                <Route path={"/profile"} element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />

                <Route path={"/pilot/:pilotId"} element={
                    <ProtectedRoute>
                        <PublicProfile />
                    </ProtectedRoute>
                } />

                <Route path={"/manager"} element={
                    <ProtectedRoute>
                        <Manager />
                    </ProtectedRoute>
                } />

                <Route path={"/acars"} element={
                    <ProtectedRoute>
                        <Acars />
                    </ProtectedRoute>
                } />

                <Route path={"/admin"} element={
                    <ProtectedRoute>
                        <AdminZone />
                    </ProtectedRoute>
                } />

                <Route path={"/change-hub"} element={
                    <ProtectedRoute>
                        <ChangeHub />
                    </ProtectedRoute>
                } />

                <Route path={"/change-airline"} element={
                    <ProtectedRoute>
                        <ChangeAirline />
                    </ProtectedRoute>
                } />

                <Route path={"/change-position"} element={
                    <ProtectedRoute>
                        <ChangePosition />
                    </ProtectedRoute>
                } />

                <Route path={"/delete-account"} element={
                    <ProtectedRoute>
                        <DeleteAccount />
                    </ProtectedRoute>
                } />

                <Route path={"/archive"} element={
                    <ProtectedRoute>
                        <Archive />
                    </ProtectedRoute>
                } />

            </Routes>
            {showCallsignPrompt && <CallsignPrompt onClose={() => setShowCallsignPrompt(false)} />}
            <CookieBanner />
            <Footer />
        </div>
    );
}

export default App;
