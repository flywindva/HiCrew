import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './stats.scss';
import api from '../../api/api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export function Stats() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        monthlyFlights: [],
        annualFlights: [],
        pilotCount: 0,
        mostFlownAircraft: [],
        mostFlownFleet: [],
        monthlyHours: [],
        annualHours: [],
        bestPilotPerMonth: [],
        mostFrequentDepartures: [],
        mostFrequentArrivals: [],
        flightsByNetworkAndType: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/flights/stats');
                setStats(response.data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                setError(t('failed-to-fetch-stats'));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [t]);

    // Chart configurations
    const monthlyFlightsChart = {
        labels: stats.monthlyFlights.map(f => f.month),
        datasets: [{
            label: t('monthly-flights'),
            data: stats.monthlyFlights.map(f => f.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        }],
    };

    const annualFlightsChart = {
        labels: stats.annualFlights.map(f => f.year),
        datasets: [{
            label: t('annual-flights'),
            data: stats.annualFlights.map(f => f.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }],
    };

    const mostFlownAircraftChart = {
        labels: stats.mostFlownAircraft.map(a => a.aircraft),
        datasets: [{
            label: t('flights'),
            data: stats.mostFlownAircraft.map(a => a.count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }],
    };

    const mostFlownFleetChart = {
        labels: stats.mostFlownFleet.map(f => `${f.registration} (${f.name})`),
        datasets: [{
            label: t('flights'),
            data: stats.mostFlownFleet.map(f => f.count),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
        }],
    };

    const monthlyHoursChart = {
        labels: stats.monthlyHours.map(h => h.month),
        datasets: [{
            label: t('monthly-hours'),
            data: stats.monthlyHours.map(h => h.hours),
            fill: false,
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.1,
        }],
    };

    const annualHoursChart = {
        labels: stats.annualHours.map(h => h.year),
        datasets: [{
            label: t('annual-hours'),
            data: stats.annualHours.map(h => h.hours),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }],
    };

    const bestPilotChart = {
        labels: stats.bestPilotPerMonth.map(p => p.month),
        datasets: [{
            label: t('flights'),
            data: stats.bestPilotPerMonth.map(p => p.flightCount),
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
        }],
    };

    const mostFrequentDeparturesChart = {
        labels: stats.mostFrequentDepartures.map(d => `${d.name} (${d.icao})`),
        datasets: [{
            label: t('departures'),
            data: stats.mostFrequentDepartures.map(d => d.count),
            backgroundColor: stats.mostFrequentDepartures.map((_, i) => `rgba(54, 162, ${100 + i * 30}, 0.5)`),
        }],
    };

    const mostFrequentArrivalsChart = {
        labels: stats.mostFrequentArrivals.map(a => `${a.name} (${a.icao})`),
        datasets: [{
            label: t('arrivals'),
            data: stats.mostFrequentArrivals.map(a => a.count),
            backgroundColor: stats.mostFrequentArrivals.map((_, i) => `rgba(255, 99, ${100 + i * 30}, 0.5)`),
        }],
    };

    const flightsByNetworkAndTypeChart = {
        labels: stats.flightsByNetworkAndType.map(f => `${f.network} - ${f.type}`),
        datasets: [{
            label: t('flights'),
            data: stats.flightsByNetworkAndType.map(f => f.count),
            backgroundColor: stats.flightsByNetworkAndType.map((_, i) => `rgba(${(i * 60) % 255}, ${(i * 80) % 255}, ${(i * 100) % 255}, 0.5)`),
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: (ctx) => ctx.chart.data.datasets[0].label },
        },
    };

    return (
        <div className="stats-container">
            <h1>{t('flight-statistics')}</h1>
            {loading ? (
                <p className="loading">{t('loading')}</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <div className="stat-summary">
                        <div className="summary-card">
                            <h3>{t('total-pilots')}</h3>
                            <p className="value">{stats.pilotCount}</p>
                        </div>
                        <div className="summary-card">
                            <h3>{t('total-flights-this-year')}</h3>
                            <p className="value">{stats.monthlyFlights.reduce((acc, f) => acc + f.count, 0)}</p>
                        </div>
                        <div className="summary-card">
                            <h3>{t('total-hours-this-year')}</h3>
                            <p className="value">{Math.round(stats.monthlyHours.reduce((acc, h) => acc + h.hours, 0))}</p>
                        </div>
                        <div className="summary-card">
                            <h3>{t('most-popular-aircraft')}</h3>
                            <p className="value">{stats.mostFlownAircraft[0]?.aircraft || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h2>{t('monthly-flights')}</h2>
                            <Line data={monthlyFlightsChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('annual-flights')}</h2>
                            <Bar data={annualFlightsChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('best-pilot-per-month')}</h2>
                            <Bar data={bestPilotChart} options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    tooltip: {
                                        callbacks: {
                                            afterLabel: function(context) {
                                                const monthData = stats.bestPilotPerMonth[context.dataIndex];
                                                return monthData?.pilot ? `${t('pilot')}: ${monthData.pilot.callsign || monthData.pilot.name}` : '';
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('most-flown-aircraft')}</h2>
                            <Bar data={mostFlownAircraftChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('most-flown-fleet')}</h2>
                            <Bar data={mostFlownFleetChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('monthly-hours')}</h2>
                            <Line data={monthlyHoursChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('annual-hours')}</h2>
                            <Bar data={annualHoursChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('most-frequent-departures')}</h2>
                            <Pie data={mostFrequentDeparturesChart} options={chartOptions} />
                        </div>
                        <div className="stat-item">
                            <h2>{t('most-frequent-arrivals')}</h2>
                            <Pie data={mostFrequentArrivalsChart} options={chartOptions} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}