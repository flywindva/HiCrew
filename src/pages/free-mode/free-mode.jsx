import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlaneCircleXmark } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/api";

export function FreeMode({ onFlightSubmit }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        departureIcao: "",
        arrivalIcao: "",
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

        try {
            const response = await api.post(
                "/flights/report/free-mode",
                {
                    departureIcao: formData.departureIcao.toUpperCase(),
                    arrivalIcao: formData.arrivalIcao.toUpperCase(),
                    network: formData.network || null,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            setSuccess(t("flight-report-submitted"));
            setFormData({
                departureIcao: "",
                arrivalIcao: "",
                network: "",
            });

            if (onFlightSubmit) {
                onFlightSubmit();
            }
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
                {t("free-mode-flight-report")} <FontAwesomeIcon icon={faPlaneCircleXmark} />
            </h1>
            <div>
                <form onSubmit={handleSubmit}>
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
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button type="submit" className="btn" disabled={loading}>
                        <FontAwesomeIcon icon={faPaperPlane} /> {loading ? t("submitting") : t("submit-report")}
                    </button>
                </form>
            </div>
        </div>
    );
}