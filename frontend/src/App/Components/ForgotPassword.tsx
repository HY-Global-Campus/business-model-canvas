import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
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

const errorStyle: CSSProperties = {
  color: '#856404',
  marginTop: '10px',
  textAlign: 'center' as const,
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#2196F3',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  width: '100%',
  marginTop: '10px',
};

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Password Reset Not Available</h1>
        <div style={{ ...errorStyle, marginTop: '20px' }}>
          <h3>⚠️ Feature Temporarily Disabled</h3>
          <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
            Password reset functionality is currently not available.
          </p>
          <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
            We apologize for the inconvenience. Please remember your password or contact
            your administrator if you need assistance.
          </p>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ color: '#4CAF50', marginBottom: '10px' }}>Alternative Options:</h4>
          <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <li>✅ Use the same password you used during registration</li>
            <li>✅ Contact your course administrator for assistance</li>
            <li>✅ Check your email for any registration confirmation (may contain password hints)</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/login')} 
          style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: '30px' }}>
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;