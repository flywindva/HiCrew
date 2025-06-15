import { useState, useEffect } from "react";
import { faBrush, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import api from "../../api/api";

export function Liveries() {
    const { t } = useTranslation();
    const [paintkits, setPaintkits] = useState([]);
    const [filteredPaintkits, setFilteredPaintkits] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPaintkits = async () => {
            try {
                const response = await api.get("/paintkits", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setPaintkits(response.data);
                setFilteredPaintkits(response.data);
                setError(null);
            } catch (err) {
                console.error(t("failed-to-fetch-paintkits"), err);
                setError(err.response?.data?.error || t("failed-to-fetch-paintkits"));
            } finally {
                setLoading(false);
            }
        };

        fetchPaintkits();
    }, [t]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = paintkits.filter((paintkit) =>
            paintkit.simulator.name.toLowerCase().includes(term) ||
            paintkit.aircraft.icao.toLowerCase().includes(term) ||
            paintkit.developer.toLowerCase().includes(term)
        );
        setFilteredPaintkits(filtered);
    };

    const sortTable = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...filteredPaintkits].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredPaintkits(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? " ↑" : " ↓";
        }
        return "";
    };

    if (loading) return <div>{t("loading")}</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="view-model">
            <h2>
                <FontAwesomeIcon icon={faBrush} /> {t("liveries")}
            </h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder={t("search-liveries")}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="table-container">
                <table className="pilot-table">
                    <thead>
                    <tr>
                        <th onClick={() => sortTable("simulatorId")}>
                            {t("simulator")} {getSortIndicator("simulatorId")}
                        </th>
                        <th onClick={() => sortTable("aircraftId")}>
                            {t("aircraft")} {getSortIndicator("aircraftId")}
                        </th>
                        <th onClick={() => sortTable("developer")}>
                            {t("developer")} {getSortIndicator("developer")}
                        </th>
                        <th>{t("download")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPaintkits.map((paintkit) => (
                        <tr key={paintkit.id} className="background-change">
                            <td>{paintkit.simulator.name}</td>
                            <td>{paintkit.aircraft.icao}</td>
                            <td>{paintkit.developer}</td>
                            <td>
                                <a href={paintkit.url} target="_blank" rel="noopener noreferrer">
                                    <button className="btn">
                                        <FontAwesomeIcon icon={faDownload} /> {t("download")}
                                    </button>
                                </a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}