import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/Rewards.css';
import RecyclingBanner from '../assets/Recycling-banner.webp';

const partnerOffers = {
  en: [
    { id: 1, name: "Shoprite", discount: "10% off", points: 50 },
    { id: 2, name: "Pick n Pay", discount: "Free reusable bag", points: 30 },
    { id: 3, name: "Woolworths", discount: "15% off organic products", points: 70 },
    { id: 4, name: "Dis-Chem", discount: "R50 off health products", points: 40 },
    { id: 5, name: "Clicks", discount: "Free beauty product", points: 60 },
    { id: 6, name: "Takealot", discount: "R100 off electronics", points: 80 }
  ],
  zu: [
    { id: 1, name: "Shoprite", discount: "10% off", points: 50 },
    { id: 2, name: "Pick n Pay", discount: "Isikhwama esisetshenziswa kabusha samahhala", points: 30 },
    { id: 3, name: "Woolworths", discount: "15% off imikhiqizo yemvelo", points: 70 }
  ],
  af: [
    { id: 1, name: "Shoprite", discount: "10% afslag", points: 50 },
    { id: 2, name: "Pick n Pay", discount: "Gratis herbruikbare sak", points: 30 },
    { id: 3, name: "Woolworths", discount: "15% afslag op organiese produkte", points: 70 }
  ]
};

export default function Rewards() {
  const { t, i18n } = useTranslation();
  const [userPoints, setUserPoints] = useState(250);
  const [redeemedOffers, setRedeemedOffers] = useState([]);
  const [notification, setNotification] = useState(null);
  const currentOffers = partnerOffers[i18n.language] || partnerOffers.en;

  const redeemOffer = (offer) => {
    if (userPoints >= offer.points) {
      setUserPoints(prev => prev - offer.points);
      setRedeemedOffers(prev => [...prev, offer.id]);
      setNotification({
        type: 'success',
        message: `${t('offer_redeemed')} ${offer.name}! ${offer.discount}`
      });
      
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({
        type: 'error',
        message: t('insufficient_points')
      });
      
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="rewards-container" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${RecyclingBanner}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Header - Updated to match Municipal page */}
      <header className="app-header">
        <div className="header-content">
          <div className="municipal-header">
            <Link to="/" className="back-btn">
              &larr; {t('back')}
            </Link>
            <div className="municipal-title">
              <h1 className="app-title">{t('Your Rewards')}</h1>
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
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="points-display">
          <div className="points-card">
            <h2>{t('your_points')}</h2>
            <div className="points-value">{userPoints}</div>
            <p className="points-description">{t('points_description')}</p>
            <div className="points-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${(userPoints / 500) * 100}%` }}
              ></div>
            </div>
            <div className="points-target">{t('next_level')}: 500 {t('points')}</div>
          </div>
        </div>
        
        <div className="offers-section">
          <h2 className="section-title">{t('available_offers')}</h2>
          <div className="offers-grid">
            {currentOffers.map((offer) => (
              <div 
                key={offer.id} 
                className={`offer-card ${redeemedOffers.includes(offer.id) ? 'redeemed' : ''}`}
              >
                <div className="offer-header">
                  <div className="offer-partner">{offer.name}</div>
                  {redeemedOffers.includes(offer.id) && (
                    <div className="redeemed-badge">{t('redeemed')}</div>
                  )}
                </div>
                <div className="offer-content">
                  <div className="offer-icon">🏆</div>
                  <div className="offer-details">
                    <p className="offer-discount">{offer.discount}</p>
                    <p className="offer-points">
                      <span className="points-required">{offer.points}</span> {t('points')}
                    </p>
                  </div>
                </div>
                <button 
                  className={`redeem-btn ${redeemedOffers.includes(offer.id) ? 'disabled' : ''}`}
                  onClick={() => redeemOffer(offer)}
                  disabled={redeemedOffers.includes(offer.id) || userPoints < offer.points}
                >
                  {redeemedOffers.includes(offer.id) 
                    ? t('redeemed') 
                    : t('redeem_offer')}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="history-section">
          <h2 className="section-title">{t('redemption_history')}</h2>
          {redeemedOffers.length > 0 ? (
            <div className="history-list">
              {redeemedOffers.map(id => {
                const offer = currentOffers.find(o => o.id === id);
                return (
                  <div key={id} className="history-item">
                    <div className="history-partner">{offer.name}</div>
                    <div className="history-details">
                      <span>{offer.discount}</span>
                      <span className="history-points">-{offer.points} {t('points')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-history">{t('no_history')}</p>
          )}
        </div>
      </div>
    </div>
  );
}