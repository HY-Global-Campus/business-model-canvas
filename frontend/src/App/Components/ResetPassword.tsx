import React, { CSSProperties, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../api/auth';
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

const inputStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '15px 0',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '16px',
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  width: '100%',
  marginTop: '10px',
};

const linkButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#4CAF50',
  cursor: 'pointer',
  fontSize: '14px',
  marginTop: '10px',
  textDecoration: 'underline',
};

const errorStyle: CSSProperties = {
  color: '#f44336',
  marginTop: '10px',
};

const successStyle: CSSProperties = {
  color: '#4CAF50',
  marginTop: '10px',
};

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      
      try {
        const response = await validateResetToken(token);
        setTokenValid(response.valid);
      } catch (error) {
        setTokenValid(false);
      }
    };
    
    validateToken();
  }, [token]);

  const passwordResetMutation = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => 
      resetPassword(token, newPassword),
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: Error) => {
      alert(error.message || 'Failed to reset password. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please make sure both fields are identical.');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long for security.');
      return;
    }
    
    if (!token) {
      alert('Invalid or missing reset token');
      return;
    }
    
    passwordResetMutation.mutate({ token, newPassword });
  };

  if (tokenValid === null) {
    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <h1>Validating Token...</h1>
          <p>Please wait while we validate your password reset token.</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <h1>Invalid or Expired Token</h1>
          <p style={errorStyle}>
            The password reset link you used is invalid or has expired.
          </p>
          <p>
            Password reset tokens are valid for 1 hour. Please request a new reset link.
          </p>
          <button 
            onClick={() => navigate('/forgot-password')} 
            style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: '20px' }}>
            Request New Reset Link
          </button>
          <button 
            onClick={() => navigate('/login')} 
            style={linkButtonStyle}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <h1>Password Reset Successful!</h1>
          <div style={successStyle}>
            <p>Your password has been reset successfully.</p>
            <p>You can now login with your new password.</p>
          </div>
          <button 
            onClick={() => navigate('/login')} 
            style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: '20px' }}>
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Reset Password</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your new password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              placeholder="Re-enter your new password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={passwordResetMutation.isPending}>
            {passwordResetMutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>

          {passwordResetMutation.isError && (
            <p style={errorStyle}>
              {passwordResetMutation.error?.message || 'Failed to reset password. Please try again.'}
            </p>
          )}

          <button 
            type="button" 
            onClick={() => navigate('/login')} 
            style={linkButtonStyle}>
            Remember your password? Login here
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;