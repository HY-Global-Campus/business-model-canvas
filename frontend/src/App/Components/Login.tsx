import React, { CSSProperties, useEffect, useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, loginWithAuthCode } from '../api/auth';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';

interface LoginResponse {
  token: string;
  displayName: string;
  id: string;
}

interface LoginVariables {
  username: string;
  password: string;
}

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
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '60px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const inputStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const labelStyle: CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const buttonStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authAttempted, setAuthAttempted] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from: Location })?.from?.pathname || '/';

  const mutation: UseMutationResult<LoginResponse, Error, LoginVariables> = useMutation({
    mutationFn: ({ username, password }: LoginVariables) => login(username, password),
    onSuccess: (data: LoginResponse) => {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('displayName', data.displayName);
      sessionStorage.setItem('id', data.id);
      navigate(from);  // Redirect to the previous page
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    },
  });

  const authcodeMutation: UseMutationResult<LoginResponse, Error, string> = useMutation({
    mutationFn: (authcode: string) => loginWithAuthCode(authcode),
    onSuccess: (data: LoginResponse) => {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('displayName', data.displayName);
      sessionStorage.setItem('id', data.id);
      navigate(from);  // Redirect to the previous page
    },
    onError: (error: Error) => {
      console.error('Authcode login failed:', error);
      alert('Authcode login failed: ' + error.message);
      const params = new URLSearchParams(location.search);
      params.delete('authcode');
      navigate({
        pathname: location.pathname,
        search: params.toString()
      }, { replace: true });
    },
  });

  useEffect(() => {
    if (!authAttempted) {
      const params = new URLSearchParams(location.search);
      const authcode = params.get('authcode');
      if (authcode) {
        setAuthAttempted(true);
        authcodeMutation.mutate(authcode);
      }
    }
  }, [location.search, authcodeMutation, navigate, location.pathname, authAttempted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        {mutation.isPending && <p>Loading...</p>}
        {mutation.isError && <p style={{ color: 'red' }}>Error: {mutation.error?.message}</p>}
        {authcodeMutation.isPending && <p>Loading...</p>}
        {authcodeMutation.isError && <p style={{ color: 'red' }}>Error: {authcodeMutation.error?.message}</p>}
      </div>
    </div>
  );
};

export default Login;
