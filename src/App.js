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

function App() {


    return (
        <div className="app">
            <Navbar/>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/rules"} element={<Rules />} />

                <Route path={"/central"} element={<Central />} />

                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/forgot"} element={<Forgot />} />

                <Route path={"/privacy-policy"} element={<PrivacyPolicy />} />
                <Route path={"/cookie-policy"} element={<CookiePolicy />} />

                <Route path={"/pilots"} element={<PilotList />} />
                <Route path={"/events"} element={<Events />} />
                <Route path={"/notams"} element={<Notams />} />
                <Route path={"/tours"} element={<Tours />} />

            </Routes>
            <CookieBanner />
            <Footer />
        </div>
    );
}

export default App;
