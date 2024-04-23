
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const buttonStyle: CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    fontSize: '70px',
    fontStyle: 'bold',
    color: 'black',
    backgroundColor: 'unset',
    border: 'none',
    cursor: 'pointer',
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
      <img src="logo-url.png" alt="Logo" />
      <p>University of Helsinki</p>
        <button style={buttonStyle} onClick={() => navigate('/exercise')}>
          &gt;
        </button>
    </div>
    </>
  );
}

export default FrontPage;


