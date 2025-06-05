import {faCopy, faEject, faEye, faEyeSlash, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

export function Acars(){
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("uindiuandac839mf");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert("Copied to clipboard!"),
            (err) => console.error("Failed to copy:", err)
        );
    };

    const regeneratePassword = () => {
        const newPassword = Math.random().toString(36).slice(2, 18);
        setPassword(newPassword);
    };

    return(<>
        <div className={"view-model left"}>
            <h1><FontAwesomeIcon icon={faEject}/> HiACARS!</h1>
            <p>HiACARS! is an advanced automatic tracking system designed for flight simulation, allowing you to fly and
                report within your airline. It is compatible with <b>X-Plane 11, X-Plane 12, MSFS2020</b> and <b>MSFS
                    2024</b>, support for FSX and Prepar3d coming soon. We are also working on compatibility with other
                simulators. One program, multiple airlines—HiACARS! seamlessly integrates with various airlines using
                the HiCrew! System.</p>
            <p>Web for downloading: <a href={"https://diazro.me/hicrew"} target={"_blank"}>HiACARS DOWNLOAD</a></p>
            <p>Credentials for logging into ACARS:</p>
            <p>
                URL AIRLINE: https://diazro.me/hicrew{" "}
                <FontAwesomeIcon
                    icon={faCopy}
                    className="copy-icon"
                    onClick={() => copyToClipboard("https://diazro.me/hicrew")}
                    style={{cursor: "pointer", marginLeft: "8px"}}
                    title="Copy URL"
                />
            </p>
            <p>
                PASSWORD:{" "}
                <span className="password">
          {showPassword ? password : "••••••••••••••••"}
                </span>{" "}
                <FontAwesomeIcon
                    icon={faCopy}
                    className="copy-icon"
                    onClick={() => copyToClipboard(password)}
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                    title="Copy Password"
                />
                <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                    style={{cursor: "pointer", marginLeft: "8px"}}
                    title={showPassword ? "Hide Password" : "Show Password"}
                />
                <FontAwesomeIcon
                    icon={faSyncAlt}
                    className="refresh-password"
                    onClick={regeneratePassword}
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                    title="Regenerate Password"
                />
            </p>
        </div>
    </>)
}