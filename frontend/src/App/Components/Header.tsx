import hyLogoWhite from '../../assets/HY-Logo_White.svg'
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg'

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

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>Book of Serendip</h1>
            <img src={hyLogoWhite} alt="Logo" style={logoStyle} />
        </header>
    );
};

export default Header;
