import { useState } from 'react';
import {faBoxArchive, faBrush, faFile} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useTranslation} from "react-i18next";
import {Documents} from "./documents";
import {Liveries} from "./liveries";

export function Archive() {
    const [activeSection, setActiveSection] = useState(null);
    const { t } = useTranslation();

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'liveries':
                return (
                    <Liveries />
                );
            case 'doc':
                return (
                    <Documents />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div className="view-model">
                <h1><FontAwesomeIcon icon={faBoxArchive} /> {t('central-archive')}</h1>
                <div className="admin-buttons">
                        <button
                            className={`btn ${activeSection === 'liveries' ? 'secondary' : ''}`}
                            onClick={() => toggleSection('liveries')}
                        >
                            <FontAwesomeIcon icon={faBrush} /> {t('liveries')}
                        </button>
                        <button
                            className={`btn ${activeSection === 'doc' ? 'secondary' : ''}`}
                            onClick={() => toggleSection('doc')}
                        >
                            <FontAwesomeIcon icon={faFile} /> {t('documentation')}
                        </button>
                </div>

            </div>
            {activeSection && renderSectionContent()}
        </>
    );
}