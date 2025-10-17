import '../pages.css'
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo-hy-mooc.png'

function FrontPage() {
  const navigate = useNavigate();

  return (
    <div className="front-background">
      <div className="front-container">
        <h1 className="front-title">Business Model Canvas</h1>
        <h2 className="front-subtitle">Design & Validate Your Business Model</h2>
        <img src={logo} alt="HY MOOC logo" className="front-logo" />
        <p className="front-university">University of Helsinki</p>
        <button 
          className="front-start-button"
          onClick={() => navigate('/bmc')}
        >
          Start Your Canvas →
        </button>
        <div className="front-description">
          <p>
            The Business Model Canvas is a strategic management tool that helps you 
            describe, design, challenge, and pivot your business model.
          </p>
          <p>
            Get started by creating your canvas, and our AI advisor will help you 
            refine and validate your ideas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;

