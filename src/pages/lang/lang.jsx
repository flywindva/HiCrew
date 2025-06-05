import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Lang() {
    const { i18n } = useTranslation();
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

    // Handle language change
    const handleLangChange = (event) => {
        const newLang = event.target.value;
        setSelectedLang(newLang);
        localStorage.setItem('language', newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <>
            <div className="view-model">
                <select value={selectedLang} onChange={handleLangChange}>
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}