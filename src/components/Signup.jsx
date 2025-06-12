import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Auth.css';
import recycling from '../assets/recycling.jpg';

export default function Signup({ setIsAuthenticated }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsAuthenticated(true);
    navigate('/');
  };

  return (
    <div 
      className="auth-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${recycling})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="auth-card" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 className="auth-title" style={{ color: '#2ecc71', textAlign: 'center' }}>{t('signup')}</h1>
        {error && <div className="auth-error" style={{
          color: '#e74c3c',
          backgroundColor: '#fadbd8',
          padding: '0.5rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="fullName" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#34495e',
              fontWeight: '500'
            }}>{t('Full Name')}</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('Full name')}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdc3c7',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#34495e',
              fontWeight: '500'
            }}>{t('email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdc3c7',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#34495e',
              fontWeight: '500'
            }}>{t('password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_placeholder')}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdc3c7',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#34495e',
              fontWeight: '500'
            }}>{t('confirm_password')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirm_password_placeholder')}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdc3c7',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-btn"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              marginBottom: '1rem'
            }}
          >
            {t('signup_button')}
          </button>
        </form>
        
        <div className="auth-footer" style={{ textAlign: 'center', color: '#34495e' }}>
          <p>{t('have_account')} <Link to="/login" style={{ color: '#27ae60', textDecoration: 'none' }}>{t('login_link')}</Link></p>
        </div>
      </div>
    </div>
  );
}