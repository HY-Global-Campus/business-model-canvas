
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import hyLogo from '../../../assets/HY_Logo.svg'

function FrontPage() {

  const navigate = useNavigate();
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'rgb(70, 70, 70)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  };

  const inputStyle: CSSProperties = {
    margin: '20px 0',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(70, 70, 70, 0)',
    color: 'white',
    width: '200px',  // Setting a width to ensure it is visible
    textAlign: 'center'
  };

  const logoStyle: CSSProperties = {
	width: '200px',
	height: 'auto',
  };


  return (
		<>
       <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 0.7);
            opacity: 1; /* Full opacity for placeholder */
          }
        `}
      </style>
    <div style={containerStyle}>
      <h1>Book of Serendip</h1>
        <input 
          style={inputStyle} 
          type="text" 
          placeholder="Enter your name"
        />
      <p>2050</p>
      <img src={hyLogo} alt="Logo" style={logoStyle} />

    </div>
    </>
  );
}

export default FrontPage;


