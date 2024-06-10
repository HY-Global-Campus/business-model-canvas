
import React, { useEffect, useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, loginWithAuthCode } from '../api/auth';

interface LoginResponse {
  token: string;
  displayName: string;
  id: string;
}

interface LoginVariables {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authAttempted, setAuthAttempted] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const mutation: UseMutationResult<LoginResponse, Error, LoginVariables> = useMutation({
    mutationFn: ({ username, password }: LoginVariables) => login(username, password),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('displayName', data.displayName);
      localStorage.setItem('id', data.id);
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    },
  });

  const authcodeMutation: UseMutationResult<LoginResponse, Error, string> = useMutation({
    mutationFn: (authcode: string) => loginWithAuthCode(authcode),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('displayName', data.displayName);
      localStorage.setItem('id', data.id);
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Authcode login failed:', error);
      alert('Authcode login failed: ' + error.message);
    },
    onSettled: () => {
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {mutation.isPending && <p>Loading...</p>}
      {mutation.isError && <p style={{ color: 'red' }}>Error: {mutation.error?.message}</p>}
      {authcodeMutation.isPending && <p>Loading...</p>}
      {authcodeMutation.isError && <p style={{ color: 'red' }}>Error: {authcodeMutation.error?.message}</p>}
    </div>
  );
};

export default Login;

