import { useState } from 'react';
import { Role } from '../../components/auth-context/role';
import {NotamsManager} from "./notams-manager";
import {RulesManager} from "./rules-manager";
import {EventManager} from "./event-manager";
import {SocialManager} from "./social-manager";
import {PermissionManager} from "./permission-manager";
import {ConfigWebsite} from "./config-website";
import {Request, RequestJoinManager} from "./request";
import {StaffListManager} from "./staff-list-manager";
import {DocumentationManager} from "./documentation-manager";
import {SimulatorManager} from "./simulator-manager";
import {AircraftManager} from "./aircraft-manager";
import {RankManager} from "./rank-manager";
import {FleetManager} from "./fleet-manager";
import {PaintkitManager} from "./paintkit-manager";
import {AirportManager} from "./airport-manager";
import {AirlineManager} from "./airline-manager";
import {HubManager} from "./hub-manager";
import {MedalManager} from "./medal-manager";
import {MedalUserManager} from "./medal-user-manager";
import {UserManager} from "./user-manager";
import {FlightManager} from "./flight-manager";

export function AdminZone() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'permissions':
                return (
                    <PermissionManager />
                );
            case 'rules':
                return (
                    <RulesManager />
                );
            case 'documents':
                return (
                    <DocumentationManager />
                );
            case 'paints':
                return (
                    <PaintkitManager />
                );
            case 'tours':
                return (
                    <></>
                );
            case 'users':
                return (
                    <UserManager />
                );
            case 'notams':
                return (
                    <NotamsManager />
                );
            case 'events':
                return (
                    <EventManager/>
                );
            case 'social':
                return (
                    <SocialManager />
                );
            case 'fleet':
                return (
                    <FleetManager />
                );
            case 'aircraft':
                return (
                    <AircraftManager />
                );
            case 'routes':
                return (
                    <></>
                );
            case 'config':
                return (
                    <ConfigWebsite />
                );
            case 'request':
                return (
                    <RequestJoinManager />
                );
            case 'staff':
                return (
                    <StaffListManager />
                );
            case 'simulator':
                return (
                    <SimulatorManager />
                );
            case 'rank':
                return (
                    <RankManager />
                );
            case 'airport':
                return (
                    <AirportManager />
                );
            case 'airlines':
                return (
                    <AirlineManager />
                );
            case 'hub':
                return (
                    <HubManager />
                );
            case 'awards':
                return (
                    <MedalManager />
                );
            case 'awards-user':
                return (
                    <MedalUserManager />
                );
            case 'validation':
                return (
                  <FlightManager />
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
                    <button
                        className={`btn ${activeSection === 'staff' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('staff')}
                    >
                        Staff list
                    </button>
                    <button
                        className={`btn ${activeSection === 'config' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('config')}
                    >
                        Configuration Web
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
                    <button
                        className={`btn ${activeSection === 'request' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('request')}
                    >
                        Request
                    </button>
                    <button
                        className={`btn ${activeSection === 'rank' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('rank')}
                    >
                        Rank Manager
                    </button>
                    <button
                        className={`btn ${activeSection === 'awards' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('awards')}
                    >
                        Awards Manager
                    </button>
                    <button
                        className={`btn ${activeSection === 'awards-user' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('awards-user')}
                    >
                        Awards User Manager
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
                    <button
                        className={`btn ${activeSection === 'hub' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('hub')}
                    >
                        HUB
                    </button>
                    <button
                        className={`btn ${activeSection === 'airlines' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('airlines')}
                    >
                        Airlines
                    </button>
                    <button
                        className={`btn ${activeSection === 'simulator' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('simulator')}
                    >
                        Simulators
                    </button>
                    <button
                        className={`btn ${activeSection === 'airport' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('airport')}
                    >
                        Airports
                    </button>
                </Role>
                <Role has={"VALIDATOR_MANAGER"}>
                    <button
                        className={`btn ${activeSection === 'validation' ? 'secondary' : ''}`}
                        onClick={() => toggleSection('validation')}
                    >
                        Validation flights
                    </button>
                </Role>
            </div>

        </div>
            {activeSection && renderSectionContent()}
        </>
    );
}