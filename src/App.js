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
import {Manager} from "./pages/manager/manager";
import {Acars} from "./pages/acars/acars";
import {AdminZone} from "./pages/admin/admin-zone";
import {Lang} from "./pages/lang/lang";

function App() {


    return (
        <div className="app">
            <Navbar/>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/rules"} element={<Rules />} />
                <Route path={"/lang"} element={<Lang />} />

                <Route path={"/central"} element={<Central />} />

                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/forgot"} element={<Forgot />} />

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

            </Routes>
            <CookieBanner />
            <Footer />
        </div>
    );
}

export default App;
