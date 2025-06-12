import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/Municipal.css';
import RecyclingBanner from '../assets/Recycling-banner.webp';


export default function Municipal() {
  const { t, i18n } = useTranslation();
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [optimizedRoutes, setOptimizedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on time range
        const mockData = timeRange === 'day' 
          ? [
              { id: 1, x: 'Soweto', y: 82, bins: 45, collected: 37, population: 1.2 },
              { id: 2, x: 'Khayelitsha', y: 38, bins: 32, collected: 12, population: 0.8 },
              { id: 3, x: 'Alexandra', y: 65, bins: 28, collected: 18, population: 0.5 },
              { id: 4, x: 'Diepsloot', y: 71, bins: 41, collected: 29, population: 0.9 },
              { id: 5, x: 'Gugulethu', y: 59, bins: 35, collected: 21, population: 0.7 },
            ]
          : timeRange === 'week'
          ? [
              { id: 1, x: 'Soweto', y: 75, bins: 120, collected: 90, population: 1.2 },
              { id: 2, x: 'Khayelitsha', y: 42, bins: 85, collected: 36, population: 0.8 },
              { id: 3, x: 'Alexandra', y: 38, bins: 92, collected: 35, population: 0.5 },
              { id: 4, x: 'Diepsloot', y: 65, bins: 110, collected: 72, population: 0.9 },
              { id: 5, x: 'Gugulethu', y: 53, bins: 78, collected: 41, population: 0.7 },
            ]
          : [
              { id: 1, x: 'Soweto', y: 78, bins: 520, collected: 405, population: 1.2 },
              { id: 2, x: 'Khayelitsha', y: 45, bins: 380, collected: 171, population: 0.8 },
              { id: 3, x: 'Alexandra', y: 41, bins: 410, collected: 168, population: 0.5 },
              { id: 4, x: 'Diepsloot', y: 68, bins: 475, collected: 323, population: 0.9 },
              { id: 5, x: 'Gugulethu', y: 56, bins: 340, collected: 190, population: 0.7 },
            ];
        
        // Mock alerts
        const mockAlerts = [
          { id: 1, area: 'Khayelitsha', type: 'overflow', status: 'critical', time: '2 hours ago' },
          { id: 2, area: 'Alexandra', type: 'damage', status: 'warning', time: '5 hours ago' },
          { id: 3, area: 'Gugulethu', type: 'low-collection', status: 'warning', time: '1 day ago' },
        ];
        
        setHeatmapData(mockData);
        setAlerts(mockAlerts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  const generateOptimizedRoutes = () => {
    // Mock route optimization
    const highActivityAreas = heatmapData.filter(area => area.y > 60);
    const routes = highActivityAreas.map((area, index) => ({
      id: index + 1,
      name: `Route ${index + 1}`,
      areas: [area.x],
      distance: Math.floor(Math.random() * 50) + 10,
      bins: area.bins,
      efficiency: Math.floor(Math.random() * 30) + 70
    }));
    
    setOptimizedRoutes(routes);
    setSelectedRoute(routes[0]);
    
    alert(`Generated optimized routes for ${highActivityAreas.length} high-activity areas`);
  };

  const resolveAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  if (loading) {
    return (
      <div className="municipal-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="municipal-container" style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${RecyclingBanner}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden'
  }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="municipal-header">
            <Link to="/" className="back-btn">
              &larr; {t('back')}
            </Link>
            <div className="municipal-title">
              <h1 className="app-title">{t('municipal_dashboard')}</h1>
            </div>
            <div className="header-controls">
              <select 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="language-selector"
              >
                <option value="en">🇺🇸 English</option>
                <option value="zu">🇿🇦 isiZulu</option>
                <option value="af">🇿🇦 Afrikaans</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="time-selector">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="day">{t('last_day')}</option>
              <option value="week">{t('last_week')}</option>
              <option value="month">{t('last_month')}</option>
            </select>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <h3>{t('total_areas')}</h3>
            <div className="stat-number">{heatmapData.length}</div>
          </div>
          <div className="stat-card">
            <h3>{t('avg_rate')}</h3>
            <div className="stat-number">
              {Math.round(heatmapData.reduce((acc, area) => acc + area.y, 0) / heatmapData.length)}%
            </div>
          </div>
          <div className="stat-card">
            <h3>{t('total_bins')}</h3>
            <div className="stat-number">
              {heatmapData.reduce((acc, area) => acc + area.bins, 0)}
            </div>
          </div>
          <div className="stat-card">
            <h3>{t('collected')}</h3>
            <div className="stat-number">
              {heatmapData.reduce((acc, area) => acc + area.collected, 0)}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="heatmap-section card-bg">
            <h2 className="section-title">{t('recycling_heatmap')}</h2>
            <div className="heatmap-container">
              {heatmapData.map((area) => (
                <div 
                  key={area.id}
                  className="heatmap-area"
                  style={{
                    backgroundColor: `rgba(79, 209, 199, ${area.y / 100 * 0.6})`,
                    borderColor: area.y > 60 ? '#27ae60' : area.y > 40 ? '#f39c12' : '#e74c3c',
                  }}
                >
                  <span className="area-name">{area.x}</span>
                  <div className="area-stats">
                    <div className="recycling-rate">
                      <strong>{area.y}%</strong> {t('recycling_rate')}
                    </div>
                    <div className="bins-count">
                      <strong>{area.bins}</strong> {t('bins_serviced')}
                    </div>
                    <div className="bins-count">
                      <strong>{area.collected}</strong> {t('collected')}
                    </div>
                    <div className="status-indicator">
                      <span className={`status ${area.y > 60 ? 'good' : area.y > 40 ? 'warning' : 'critical'}`}>
                        {area.y > 60 ? '✓ Good' : area.y > 40 ? '⚠ Needs Attention' : '✗ Critical'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="alerts-section card-bg">
            <h2 className="section-title">{t('alerts')}</h2>
            <div className="alerts-container">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-card ${alert.status}`}>
                  <div className="alert-header">
                    <div className="alert-type">{alert.type}</div>
                    <div className="alert-time">{alert.time}</div>
                  </div>
                  <div className="alert-area">{alert.area}</div>
                  <div className="alert-status">{alert.status}</div>
                  <button 
                    className="resolve-btn"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    {t('resolve')}
                  </button>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="no-alerts">
                  <div className="check-icon">✓</div>
                  <p>{t('no_alerts')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="optimization-section card-bg">
          <div className="optimization-header">
            <h2 className="section-title">{t('route_optimization')}</h2>
            <button className="optimize-btn" onClick={generateOptimizedRoutes}>
              {t('generate_routes')}
            </button>
          </div>
          
          {optimizedRoutes.length > 0 && (
            <div className="optimization-content">
              <div className="routes-list">
                <h3>{t('optimized_routes')}</h3>
                <div className="routes-container">
                  {optimizedRoutes.map(route => (
                    <div 
                      key={route.id} 
                      className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="route-name">{route.name}</div>
                      <div className="route-stats">
                        <div>{route.areas.join(', ')}</div>
                        <div>{route.distance} km</div>
                        <div>{route.bins} bins</div>
                        <div>{route.efficiency}% efficiency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedRoute && (
                <div className="route-details">
                  <h3>{t('route_details')} {selectedRoute.name}</h3>
                  <div className="route-map">
                    <div className="map-placeholder">
                      <div className="map-grid">
                        {heatmapData.map(area => (
                          <div 
                            key={area.id} 
                            className={`map-cell ${selectedRoute.areas.includes(area.x) ? 'active' : ''}`}
                            style={{
                              backgroundColor: selectedRoute.areas.includes(area.x) 
                                ? `rgba(79, 209, 199, ${area.y / 100 * 0.8})` 
                                : 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            {area.x.substring(0, 1)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="route-stats-grid">
                      <div className="stat-item">
                        <div className="stat-label">{t('distance')}</div>
                        <div className="stat-value">{selectedRoute.distance} km</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">{t('bins')}</div>
                        <div className="stat-value">{selectedRoute.bins}</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">{t('efficiency')}</div>
                        <div className="stat-value">{selectedRoute.efficiency}%</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">{t('estimated_time')}</div>
                        <div className="stat-value">{Math.round(selectedRoute.distance * 3)} min</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {optimizedRoutes.length === 0 && (
            <div className="optimization-card">
              <p>{t('optimization_suggestion')}</p>
              <div className="optimization-stats">
                <p><strong>{t('high_activity')}:</strong> {heatmapData.filter(area => area.y > 60).length}</p>
                <p><strong>{t('needs_attention')}:</strong> {heatmapData.filter(area => area.y <= 60).length}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}