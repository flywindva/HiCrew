import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import api from "../../api/apì";

export function Rules() {
    const [rules, setRules] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await api.get('/rules');
                if (response?.data) {
                    setRules(response.data);
                    const latestUpdate = response.data.reduce((latest, rule) => {
                        const ruleDate = new Date(rule.updatedAt);
                        return !latest || ruleDate > latest ? ruleDate : latest;
                    }, null);
                    setLastUpdated(latestUpdate);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch rules:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch rules';
                setError(errorMessage);
            }
        };
        fetchRules();
    }, []);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="view-model left">
            <h1>
                <FontAwesomeIcon icon={faScaleBalanced} /> Rules
            </h1>
            {error && <p className="error-message">{error}</p>}
            <div className="rules-list">
                {rules.length === 0 ? (
                    <p>No rules found.</p>
                ) : (
                    rules.map((rule) => (
                            <p>- {rule.text}</p>
                    ))
                )}
            </div>
            <p className="last-updated">Last Updated: {formatDate(lastUpdated)}</p>
        </div>
    );
}