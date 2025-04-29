import './App.css';
import Navbar from "./components/navbar/navbar";
import {Home} from "./pages/home/home";
import Footer from "./components/footer/footer";
import {Route, Routes} from "react-router-dom";
import {PrivacyPolicy} from "./pages/privacy-policy/privacy-policy";
import {CookiePolicy} from "./pages/cookies/cookies";
import {CookieBanner} from "./components/cookie-banner/cookie-banner";
import {Register} from "./pages/register/register";

function App() {


    return (
        <div className="app">
            <Navbar/>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/privacy-policy"} element={<PrivacyPolicy />} />
                <Route path={"/cookie-policy"} element={<CookiePolicy />} />
            </Routes>
            <CookieBanner />
            <Footer />
        </div>
    );
}

export default App;
