import { useState, useEffect } from "react";
import { faFile, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import api from "../../api/api";

export function Documents() {
    const { t } = useTranslation();
    const [documents, setDocuments] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem("token");
                const endpoint = token ? "/documentation/all" : "/documentation";
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const response = await api.get(endpoint, { headers });
                setDocuments(response.data);
                setError(null);
            } catch (err) {
                console.error(t("failed-to-fetch-documents"), err);
                setError(err.response?.data?.error || t("failed-to-fetch-documents"));
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [t]);

    const sortTable = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...documents].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setDocuments(sortedData);
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
                <FontAwesomeIcon icon={faFile} /> {t("documentation")}
            </h2>
            <div className="table-container">
                <table className="pilot-table">
                    <thead>
                    <tr>
                        <th onClick={() => sortTable("name")}>
                            {t("name")} {getSortIndicator("name")}
                        </th>
                        <th onClick={() => sortTable("createdAt")}>
                            {t("created")} {getSortIndicator("createdAt")}
                        </th>
                        <th>{t("download")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.id} className="background-change">
                            <td>{doc.name}</td>
                            <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                            <td>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
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