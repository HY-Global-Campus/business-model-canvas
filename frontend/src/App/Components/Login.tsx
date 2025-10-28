import React, { CSSProperties, useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register } from '../api/auth';
import { setAuthToken } from '../utils/auth';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';

interface LoginResponse {
  token: string;
  displayName: string;
  id: string;
  email: string;
}

interface LoginVariables {
  email: string;
  password: string;
}

interface RegisterVariables {
  email: string;
  password: string;
  displayName: string;
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
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '60px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: '450px',
  width: '100%',
};

const inputStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const labelStyle: CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
  display: 'block',
  textAlign: 'left',
};

const buttonStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '10px',
};

const linkButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#4CAF50',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '14px',
  marginTop: '15px',
};

const errorStyle: CSSProperties = {
  color: 'red',
  marginTop: '10px',
  fontSize: '14px',
};

const Login: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from: Location })?.from?.pathname || '/';

  const loginMutation: UseMutationResult<LoginResponse, Error, LoginVariables> = useMutation({
    mutationFn: ({ email, password }: LoginVariables) => login(email, password),
    onSuccess: (data: LoginResponse) => {
      const success = setAuthToken(data.token, data.displayName, data.id, data.email);
      if (success) {
        navigate(from);
      } else {
        alert('Login failed: Invalid token received from server');
      }
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
    },
  });

  const registerMutation: UseMutationResult<LoginResponse, Error, RegisterVariables> = useMutation({
    mutationFn: ({ email, password, displayName }: RegisterVariables) => 
      register(email, password, displayName),
    onSuccess: (data: LoginResponse) => {
      const success = setAuthToken(data.token, data.displayName, data.id, data.email);
      if (success) {
        navigate(from);
      } else {
        alert('Registration failed: Invalid token received from server');
      }
    },
    onError: (error: Error) => {
      console.error('Registration failed:', error);
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    registerMutation.mutate({ email, password, displayName });
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    loginMutation.reset();
    registerMutation.reset();
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>{isRegisterMode ? 'Register' : 'Login'}</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          {isRegisterMode 
            ? 'Create a new account to get started' 
            : 'Welcome back! Please login to continue'}
        </p>

        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label style={labelStyle}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
            {loginMutation.isError && (
              <p style={errorStyle}>
                {loginMutation.error?.message || 'Login failed. Please check your credentials.'}
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div>
              <label style={labelStyle}>Display Name:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={inputStyle}
                placeholder="How should we call you?"
                required
                minLength={2}
              />
            </div>
            <div>
              <label style={labelStyle}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Re-enter your password"
                required
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creating account...' : 'Register'}
            </button>
            {registerMutation.isError && (
              <p style={errorStyle}>
                {registerMutation.error?.message || 'Registration failed. Please try again.'}
              </p>
            )}
          </form>
        )}

        <button onClick={toggleMode} style={linkButtonStyle}>
          {isRegisterMode 
            ? 'Already have an account? Login here' 
            : "Don't have an account? Register here"}
        </button>
      </div>
    </div>
  );
};

export default Login;
