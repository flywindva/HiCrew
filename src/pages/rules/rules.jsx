import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/apì';
import { useTranslation } from 'react-i18next';

export function Rules() {
    const { t, i18n } = useTranslation();
    const [rules, setRules] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await api.get('/rules');
                if (response?.data) {
                    const allRules = response.data;
                    const currentLang = i18n.language.toUpperCase();

                    let filteredRules = allRules.filter((rule) => rule.lang?.toUpperCase() === currentLang);

                    if (filteredRules.length === 0) {
                        filteredRules = allRules.filter((rule) => rule.lang?.toUpperCase() === 'EN');
                    }

                    if (filteredRules.length === 0 && allRules.length > 0) {
                        const availableLangs = [...new Set(allRules.map((rule) => rule.lang?.toUpperCase()))].filter(Boolean);
                        if (availableLangs.length > 0) {
                            filteredRules = allRules.filter((rule) => rule.lang?.toUpperCase() === availableLangs[0]);
                        }
                    }

                    setRules(filteredRules);

                    const latestUpdate = filteredRules.reduce((latest, rule) => {
                        const ruleDate = new Date(rule.updatedAt);
                        return !latest || ruleDate > latest ? ruleDate : latest;
                    }, null);
                    setLastUpdated(latestUpdate);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-rules'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-rules'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-rules');
                setError(errorMessage);
            }
        };
        fetchRules();
    }, [t, i18n.language]);

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
                <FontAwesomeIcon icon={faScaleBalanced} /> {t('rules-title')}
            </h1>
            {error && <p className="error-message">{error}</p>}
            <div className="rules-list">
                {rules.length === 0 ? (
                    <p>{t('no-rules-found')}</p>
                ) : (
                    rules.map((rule, index) => (
                        <p key={rule.id}>- {rule.text}</p>
                    ))
                )}
            </div>
            <p className="last-updated">
                {t('last-updated')}: {formatDate(lastUpdated)}
            </p>
        </div>
    );
}