import hyLogoWhite from '../../assets/HY-Logo_White.svg'
import borealforest_icon from '../../assets/Icon1_Milton_O.png'
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg'
import { CSSProperties } from 'react';

const Header: React.FC = () => {
    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        background: `url(${borealforest})`,
        backgroundPosition: 'center',
        color: 'white',
        height: '100px'
    };

    const titleStyle: React.CSSProperties = {
        marginLeft: '10px', // Adjust the spacing as needed
    };

    const logoStyle: React.CSSProperties = {
        height: '50px', // Adjust the size as needed
        marginRight: '10px', // Adjust the spacing as needed
    };

    const iconstyle: CSSProperties = {
        height: '60px',
        width: 'auto',
        position: 'relative',
        top: '25px'
    }

    const titlestyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        fontSize: '25px'
    }

    return (
        <header style={headerStyle}>
            <div style={titlestyle}>
                <img src={borealforest_icon} alt='Boreal forest icon' style={iconstyle} />
                <h1 style={titleStyle}>Book of Serendip</h1>
            </div>
            <img src={hyLogoWhite} alt="Logo" style={logoStyle} />
        </header>
    );
};

export default Header;
