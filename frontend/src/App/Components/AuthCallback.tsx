import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';
import { exchangeMoocCode } from '../api/auth';
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

const errorStyle: CSSProperties = {
  color: '#f44336',
  marginTop: '10px',
};

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        setError('Missing authorization code. Please try logging in again.');
        return;
      }

      try {
        const data = await exchangeMoocCode(code, state);
        const ok = setAuthToken(data.token, data.displayName, data.id, data.email);
        if (!ok) {
          setError('Login succeeded but session could not be created. Please try again.');
          return;
        }

        const redirectTo = sessionStorage.getItem('postLoginRedirect') || '/';
        sessionStorage.removeItem('postLoginRedirect');
        navigate(redirectTo);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Login failed. Please try again.';
        setError(message);
      }
    };

    run();
  }, [navigate, searchParams]);

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Signing you in…</h1>
        <p>Please wait while we complete the login.</p>
        {error && <p style={errorStyle}>{error}</p>}
        {error && (
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: '20px',
              padding: '12px',
              width: '100%',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

