import React, { useEffect, useState } from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {DivIcon, LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import airplaneIcon from './plane.svg';


const useInterval = (callback: () => void, delay: number) => {
    useEffect(() => {
        const intervalId = setInterval(callback, delay);
        return () => clearInterval(intervalId);
    }, [callback, delay]);
};

const Map: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
    const [ivao_flights, setIvao] = useState([]);
    const [vatsim_flights, setVatsim] = useState([]);


    const fetchIvaoData = async () => {
        try {
            const response = await axios.get('https://api.ivao.aero/v2/tracker/whazzup');
            setIvao(response.data.clients.pilots || []);
        } catch (error) {
            console.error('Error fetching IVAO flight data:', error);
        }
    };

    const fetchVatsimData = async () => {
        try {
            const response = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');
            setVatsim(response.data.pilots || []);
        } catch (error) {
            console.error('Error fetching VATSIM flight data:', error);
        }
    };

    useEffect(() => {
        fetchIvaoData();
        fetchVatsimData();
    }, []);

    useInterval(() => {
        fetchIvaoData();
        fetchVatsimData();
    }, 30000);

    const center: LatLngExpression = [0.0, 0.0];

    const tileLayerUrl =
        theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileLayerAttribution =
        theme === 'dark'
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <MapContainer
            center={center}
            zoom={2}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        >
            <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl} />
            {ivao_flights.map((ivao) => {
                if (!ivao.callsign.startsWith("IBE")) {
                    return null;
                }
                const rotation = ivao.lastTrack?.heading ?? 0;

                const customIconHtml = `<img src="${airplaneIcon}" alt="Airplane Icon" style="transform: rotate(${rotation}deg);">`;

                const airplaneMarkerIcon = new DivIcon({
                    className: 'custom-icon',
                    iconSize: [16, 16],
                    html: customIconHtml,
                });

                return (
                    <Marker
                        key={ivao.id}
                        position={[
                            ivao.lastTrack?.latitude ?? 0,
                            ivao.lastTrack?.longitude ?? 0,
                        ]}
                        icon={airplaneMarkerIcon}
                    >
                        <Popup>
                            <div>
                                <h3>{ivao.callsign}</h3>
                                <p>Departure: {ivao.flightPlan?.departureId}</p>
                                <p>Arrival: {ivao.flightPlan?.arrivalId}</p>
                                <p>Altitude: {ivao.lastTrack?.altitude}</p>
                                <p>Speed: {ivao.lastTrack?.groundSpeed}</p>
                                <p>Network: IVAO</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
            {vatsim_flights.map((vatsim) => {
                if (!vatsim.callsign || !vatsim.callsign.startsWith("IBE")) {
                    return null;
                }
                const rotation = vatsim.heading ?? 0;

                const customIconHtml = `<img src="${airplaneIcon}" alt="Airplane Icon" style="transform: rotate(${rotation}deg);">`;

                const airplaneMarkerIcon = new DivIcon({
                    className: 'custom-icon',
                    iconSize: [16, 16],
                    html: customIconHtml,
                });

                return (
                    <Marker
                        key={vatsim.cid}
                        position={[vatsim.latitude ?? 0, vatsim.longitude ?? 0]}
                        icon={airplaneMarkerIcon}
                    >
                        <Popup>
                            <div>
                                <h3>{vatsim.callsign}</h3>
                                <p>Departure: {vatsim.flight_plan?.departure || "N/A"}</p>
                                <p>Arrival: {vatsim.flight_plan?.arrival || "N/A"}</p>
                                <p>Altitude: {vatsim.altitude || "N/A"}</p>
                                <p>Speed: {vatsim.groundspeed || "N/A"}</p>
                                <p>Network: VATSIM</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;

