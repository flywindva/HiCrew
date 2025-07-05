import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/api";

export function ManualReport() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        aircraft: "",
        callsign: "",
        departureIcao: "",
        arrivalIcao: "",
        startFlight: "",
        closeFlight: "",
        pirep: "",
        network: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const icaoRegex = /^[A-Z]{4}$/;
        if (!icaoRegex.test(formData.departureIcao) || !icaoRegex.test(formData.arrivalIcao)) {
            setError(t("invalid-icao-format"));
            setLoading(false);
            return;
        }

        const callsignRegex = /^[A-Z0-9]{3,8}$/;
        if (!callsignRegex.test(formData.callsign)) {
            setError(t("invalid-callsign-format"));
            setLoading(false);
            return;
        }

        if (formData.startFlight && formData.closeFlight) {
            const start = new Date(formData.startFlight);
            const end = new Date(formData.closeFlight);
            if (end <= start) {
                setError(t("invalid-flight-times"));
                setLoading(false);
                return;
            }
        }

        try {
            const response = await api.post(
                "/flights/report/manual",
                {
                    callsign: formData.callsign,
                    aircraft: formData.aircraft,
                    departureIcao: formData.departureIcao.toUpperCase(),
                    arrivalIcao: formData.arrivalIcao.toUpperCase(),
                    startFlight: formData.startFlight ? new Date(formData.startFlight).toISOString() : null,
                    closeFlight: formData.closeFlight ? new Date(formData.closeFlight).toISOString() : null,
                    pirep: formData.pirep || null,
                    network: formData.network || null,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            setSuccess(t("flight-report-submitted"));
            setFormData({
                aircraft: "",
                callsign: "",
                departureIcao: "",
                arrivalIcao: "",
                startFlight: "",
                closeFlight: "",
                pirep: "",
                network: "",
            });
        } catch (error) {
            console.error(t("failed-to-submit-report"), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error || error.message || t("failed-to-submit-report");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h1>
                {t("manual-flight-report")} <FontAwesomeIcon icon={faPlaneDeparture} />
            </h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="callsign">{t("callsign")}</label>
                        <input
                            type="text"
                            id="callsign"
                            name="callsign"
                            value={formData.callsign}
                            onChange={handleChange}
                            required
                            placeholder="e.g. IBE1234"
                            maxLength={8}
                        />
                    </div>
                    <div>
                        <label htmlFor="aircraft">{t("aircraft")}</label>
                        <input
                            type="text"
                            id="aircraft"
                            name="aircraft"
                            value={formData.aircraft}
                            onChange={handleChange}
                            required
                            placeholder={t("enter-aircraft-type")}
                        />
                    </div>
                    <div>
                        <label htmlFor="departureIcao">{t("departure-icao")}</label>
                        <input
                            type="text"
                            id="departureIcao"
                            name="departureIcao"
                            value={formData.departureIcao}
                            onChange={handleChange}
                            required
                            placeholder="e.g. LEBL"
                            maxLength={4}
                        />
                    </div>
                    <div>
                        <label htmlFor="arrivalIcao">{t("arrival-icao")}</label>
                        <input
                            type="text"
                            id="arrivalIcao"
                            name="arrivalIcao"
                            value={formData.arrivalIcao}
                            onChange={handleChange}
                            required
                            placeholder="e.g. LEMD"
                            maxLength={4}
                        />
                    </div>
                    <div>
                        <label htmlFor="startFlight">{t("start-flight")}</label>
                        <input
                            type="datetime-local"
                            id="startFlight"
                            name="startFlight"
                            value={formData.startFlight}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="closeFlight">{t("close-flight")}</label>
                        <input
                            type="datetime-local"
                            id="closeFlight"
                            name="closeFlight"
                            value={formData.closeFlight}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="pirep">{t("tracker-link")}</label>
                        <input
                            type="url"
                            id="pirep"
                            name="pirep"
                            value={formData.pirep}
                            onChange={handleChange}
                            placeholder="e.g. https://tracker.example.com/flight/123"
                        />
                    </div>
                    <div>
                        <label htmlFor="network">{t("network")}</label>
                        <select
                            id="network"
                            name="network"
                            value={formData.network}
                            onChange={handleChange}
                        >
                            <option value="">{t("select-network")}</option>
                            <option value="IVAO">{t("ivao")}</option>
                            <option value="VATSIM">{t("vatsim")}</option>
                        </select>
                    </div>
                    {error && <p>{error}</p>}
                    {success && <p>{success}</p>}
                    <button type="submit" className="btn" disabled={loading}>
                        <FontAwesomeIcon icon={faPaperPlane}/> {loading ? t("submitting") : t("submit-report")}
                    </button>
                </form>
            </div>
        </div>
    );
}