
import { CSSProperties } from 'react';
import hyLogo from '../../../assets/HY-Logo_White.svg'
import owl from '../../../assets/serendip_owl.jpeg'
import icons from '../../../assets/Icons_all.png'

function FrontPage() {

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0)) 100%',
    paddingTop: '120px',

  };

  const inputStyle: CSSProperties = {
    margin: '10px 0',
    padding: '10px',
    fontSize: '32px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(70, 70, 70, 0)',
    color: 'white',
    width: '300px',  // Setting a width to ensure it is visible
    textAlign: 'center'
  };

  const h1style: CSSProperties = {
      fontSize: '100px'
  }

  const logoStyle: CSSProperties = {
	width: '200px',
	height: 'auto',
        position: 'fixed',
        left: '10%',
        bottom: '10%',
  };

  const iconsStyle: CSSProperties = {
    width: '500px',
    height: 'auto',
  }


  return (
		<>
       <style>
        {`
          body {
  background: url(${owl});
  background-size: cover;
  background-position: center;
}
          input::placeholder {
            color: rgba(255, 255, 255, 0.7);
            opacity: 1; /* Full opacity for placeholder */
          }
        `}
      </style>
    <div style={containerStyle}>
      <h1 style={h1style}>Book of Serendip</h1>
        <input 
          style={inputStyle} 
          type="text" 
          placeholder="Enter your name"
        />
      <img src={icons} alt='chapter icons' style={iconsStyle} />
      <img src={hyLogo} alt="Logo" style={logoStyle} />

    </div>
    </>
  );
}

export default FrontPage;


