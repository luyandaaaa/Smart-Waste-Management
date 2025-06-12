import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Home.css'; // 
import RecyclingBanner from '../assets/Recycling-banner.webp';

export default function Home({ setIsAuthenticated }) {
  const { t, i18n } = useTranslation();
  const [recycledAmount, setRecycledAmount] = useState(0);
  const targetAmount = 1240;

  // Animate the recycled amount counter
  useEffect(() => {
    const interval = setInterval(() => {
      setRecycledAmount(prev => {
        if (prev < targetAmount) {
          return Math.min(prev + 15, targetAmount);
        }
        return targetAmount;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [targetAmount]);
  
  return (
    <div className="home-container" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${RecyclingBanner})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">
              <span className="logo-icon">🌱</span>
              EcoScan
            </h1>
            <div className="logo-subtitle">Smart Recycling</div>
          </div>
          
          <div className="quick-actions">
            <Link to="/scan" className="quick-action-btn" title="Scan">
              📱
            </Link>
            <Link to="/rewards" className="quick-action-btn" title="Rewards">
              🏆
            </Link>
            <Link to="/municipal" className="quick-action-btn" title="Municipal">
              🏛️
            </Link>
            <Link to="/gamification" className="quick-action-btn" title="Gamification">
              🎮
            </Link>
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
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="logout-btn"
            >
              <span>👋</span>
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section with animated background */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="hero-title">{t('welcome')}</h2>
              <p className="hero-subtitle">{t('tagline')}</p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{recycledAmount}</div>
                  <div className="stat-label">kg recycled</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">847</div>
                  <div className="stat-label">items scanned</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">156</div>
                  <div className="stat-label">points earned</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons with hover effects */}
        <section className="action-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/scan" className="action-btn scan-btn">
              <div className="btn-icon-wrapper">
                <span className="btn-icon">📱</span>
                <div className="btn-glow"></div>
              </div>
              <div className="btn-content">
                <span className="btn-title">{t('scan_now')}</span>
                <span className="btn-desc">Identify waste instantly</span>
              </div>
              <div className="btn-arrow">→</div>
            </Link>
            
            <Link to="/rewards" className="action-btn rewards-btn">
              <div className="btn-icon-wrapper">
                <span className="btn-icon">🏆</span>
                <div className="btn-glow"></div>
              </div>
              <div className="btn-content">
                <span className="btn-title">{t('rewards_title')}</span>
                <span className="btn-desc">Redeem your points</span>
              </div>
              <div className="btn-arrow">→</div>
            </Link>
            
            <Link to="/municipal" className="action-btn municipal-btn">
              <div className="btn-icon-wrapper">
                <span className="btn-icon">🏛️</span>
                <div className="btn-glow"></div>
              </div>
              <div className="btn-content">
                <span className="btn-title">{t('municipal_portal')}</span>
                <span className="btn-desc">View city data</span>
              </div>
              <div className="btn-arrow">→</div>
            </Link>
            
            <Link to="/gamification" className="action-btn gamification-btn">
              <div className="btn-icon-wrapper">
                <span className="btn-icon">🎮</span>
                <div className="btn-glow"></div>
              </div>
              <div className="btn-content">
                <span className="btn-title">Gamification</span>
                <span className="btn-desc">Earn rewards through challenges</span>
              </div>
              <div className="btn-arrow">→</div>
            </Link>
          </div>
        </section>

        {/* Features Grid with cards */}
        <section className="features-section">
          <h3 className="section-title">Why Choose EcoScan?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌱</div>
                <div className="feature-glow"></div>
              </div>
              <h4 className="feature-title">{t('feature1_title')}</h4>
              <p className="feature-desc">{t('feature1_desc')}</p>
              <div className="feature-number">01</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">♻️</div>
                <div className="feature-glow"></div>
              </div>
              <h4 className="feature-title">{t('feature2_title')}</h4>
              <p className="feature-desc">{t('feature2_desc')}</p>
              <div className="feature-number">02</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌍</div>
                <div className="feature-glow"></div>
              </div>
              <h4 className="feature-title">Global Impact</h4>
              <p className="feature-desc">Join millions making a difference for our planet</p>
              <div className="feature-number">03</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚡</div>
                <div className="feature-glow"></div>
              </div>
              <h4 className="feature-title">Instant Results</h4>
              <p className="feature-desc">Get immediate feedback and classification</p>
              <div className="feature-number">04</div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="impact-section">
          <div className="impact-content">
            <div className="impact-text">
              <h3>Your Environmental Impact</h3>
              <p>Every scan counts towards a cleaner, greener future</p>
            </div>
            <div className="impact-visual">
              <div className="impact-circle">
                <div className="impact-progress" style={{'--progress': `${(recycledAmount / targetAmount) * 100}%`}}>
                  <span className="impact-percentage">{Math.round((recycledAmount / targetAmount) * 100)}%</span>
                </div>
              </div>
              <div className="impact-label">Monthly Goal Progress</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with animated elements */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-stats">
            <div className="footer-stat">
              <span className="footer-stat-number">{recycledAmount}kg</span>
              <span className="footer-stat-label">{t('total_recycled')}</span>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-message">
              <span className="footer-text">Making our planet greener, one scan at a time</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}