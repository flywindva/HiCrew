import { useState } from 'react';
import { Role } from '../../components/auth-context/role';
import {NotamsManager} from "./notams-manager";

export function AdminZone() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'permissions':
                return (
                    <></>
                );
            case 'rules':
                return (
                    <></>
                );
            case 'documents':
                return (
                    <></>
                );
            case 'paints':
                return (
                    <></>
                );
            case 'tours':
                return (
                    <></>
                );
            case 'users':
                return (
                    <></>
                );
            case 'notams':
                return (
                    <NotamsManager />
                );
            case 'events':
                return (
                    <></>
                );
            case 'social':
                return (
                    <></>
                );
            case 'fleet':
                return (
                    <></>
                );
            case 'aircraft':
                return (
                    <></>
                );
            case 'routes':
                return (
                    <></>
                );
            case 'config':
                return (
                    <></>
                );
            default:
                return null;
        }
    };

    return (
        <>
        <div className="view-model">
            <h1>Admin Zone</h1>
            <div className="admin-buttons">
                <Role has="ADMIN">
                    <button
                        className={`btn ${activeSection === 'permissions' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('permissions')}
                    >
                        Permissions
                    </button>
                </Role>
                <Role has="RULE_ADMIN">
                    <button
                        className={`btn ${activeSection === 'rules' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('rules')}
                    >
                        Rules
                    </button>
                </Role>
                <Role has="DOC_MANAGER">
                    <button
                        className={`btn ${activeSection === 'documents' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('documents')}
                    >
                        Documents
                    </button>
                </Role>
                <Role has="PAINT_MANAGER">
                    <button
                        className={`btn ${activeSection === 'paints' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('paints')}
                    >
                        Paints
                    </button>
                </Role>
                <Role has="TOUR_MANAGER">
                    <button
                        className={`btn ${activeSection === 'tours' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('tours')}
                    >
                        Tours Manager
                    </button>
                </Role>
                <Role has="USER_MANAGER">
                    <button
                        className={`btn ${activeSection === 'users' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('users')}
                    >
                        User Manager
                    </button>
                </Role>
                <Role has="NOTAMS_MANAGER">
                    <button
                        className={`btn ${activeSection === 'notams' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('notams')}
                    >
                        NOTAMS Manager
                    </button>
                </Role>
                <Role has="EVENT_MANAGER">
                    <button
                        className={`btn ${activeSection === 'events' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('events')}
                    >
                        Events Manager
                    </button>
                </Role>
                <Role has="SOCIAL_MANAGER">
                    <button
                        className={`btn ${activeSection === 'social' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('social')}
                    >
                        Social Networks
                    </button>
                </Role>
                <Role has="OPERATIONS_MANAGER">
                    <button
                        className={`btn ${activeSection === 'fleet' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('fleet')}
                    >
                        Fleet Manager
                    </button>
                    <button
                        className={`btn ${activeSection === 'aircraft' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('aircraft')}
                    >
                        Aircraft Manager
                    </button>
                    <button
                        className={`btn ${activeSection === 'routes' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('routes')}
                    >
                        Routes Manager
                    </button>
                </Role>
                <Role has="ADMIN">
                    <button
                        className={`btn ${activeSection === 'config' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('config')}
                    >
                        Configuration Web
                    </button>
                </Role>
            </div>

        </div>
    {activeSection && renderSectionContent()}
    </>
    );
}