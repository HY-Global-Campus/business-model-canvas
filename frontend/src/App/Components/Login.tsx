import React, { CSSProperties, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';
import { devLogin } from '../api/auth';
import { setAuthToken } from '../utils/auth';

const wrapperStyle: CSSProperties = {
  background: `url(${borealforest}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
  position: 'relative',
};

const containerStyle: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '60px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: '450px',
  width: '100%',
};

const buttonStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '10px',
};

const devButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  color: '#666',
  border: '2px solid #999',
  marginTop: '16px',
};

const errorStyle: CSSProperties = {
  color: '#f44336',
  marginTop: '12px',
  fontSize: '14px',
};

const devAuthBypassEnabled = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: Location })?.from?.pathname || '/';
  const [error, setError] = useState('');
  const [devLoading, setDevLoading] = useState(false);

  const startMoocLogin = () => {
    sessionStorage.setItem('postLoginRedirect', from);
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      alert('VITE_API_URL is not set. Cannot start login.');
      return;
    }
    window.location.href = `${apiUrl.replace(/\/$/, '')}/login/mooc/start`;
  };

  const startDevLogin = async () => {
    setError('');
    setDevLoading(true);
    try {
      const data = await devLogin();
      const ok = setAuthToken(
        data.token,
        data.displayName,
        String(data.id),
        data.email
      );
      if (!ok) {
        setError('Login succeeded but session could not be created. Please try again.');
        return;
      }
      const redirectTo = sessionStorage.getItem('postLoginRedirect') || from;
      sessionStorage.removeItem('postLoginRedirect');
      navigate(redirectTo);
    } catch {
      setError('Dev login failed. Is DEV_AUTH_BYPASS enabled on the backend?');
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Login</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Continue by signing in with mooc.fi.
        </p>
        <button onClick={startMoocLogin} style={buttonStyle}>
          Login with mooc.fi
        </button>
        {devAuthBypassEnabled && (
          <button
            onClick={startDevLogin}
            style={devButtonStyle}
            disabled={devLoading}
          >
            {devLoading ? 'Signing in…' : 'Dev login (local only)'}
          </button>
        )}
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
