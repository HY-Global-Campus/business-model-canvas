import React, { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';

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

const Login: React.FC = () => {
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const startMoocLogin = () => {
    sessionStorage.setItem('postLoginRedirect', from);
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      alert('VITE_API_URL is not set. Cannot start login.');
      return;
    }
    window.location.href = `${apiUrl.replace(/\/$/, '')}/login/mooc/start`;
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
      </div>
    </div>
  );
};

export default Login;
