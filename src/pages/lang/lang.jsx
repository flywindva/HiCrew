import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './lang.scss';

export function Lang() {
    const { t, i18n } = useTranslation();
    const languages = [
        { code: 'ES', name: 'Español' },
        { code: 'EN', name: 'English' },
        { code: 'FR', name: 'Français' },
        { code: 'PT', name: 'Português' },
        { code: 'IT', name: 'Italiano' },
        { code: 'CA', name: 'Català' },
        { code: 'EU', name: 'Euskara' },
        { code: 'GL', name: 'Galego' },
    ];

    const [selectedLang, setSelectedLang] = useState(localStorage.getItem('language') || 'EN');

    const handleLangChange = (langCode) => {
        setSelectedLang(langCode);
        localStorage.setItem('language', langCode);
        i18n.changeLanguage(langCode);
    };

    return (
        <>
            <div className="view-model">
                <h1>
                    <FontAwesomeIcon icon={faLanguage} /> {t('language-title')}
                </h1>
                <p dangerouslySetInnerHTML={{ __html: t('language-description') }} />
                <div className="lang-container">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`lang ${selectedLang === lang.code ? 'lang-select' : ''}`}
                            onClick={() => handleLangChange(lang.code)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3>{lang.code} - {lang.name}</h3>
                            <img src={`/resources/flags/${lang.code}.png`} alt={lang.name} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}