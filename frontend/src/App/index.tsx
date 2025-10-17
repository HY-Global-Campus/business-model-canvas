import { Routes, Route } from 'react-router-dom';
import FrontPage from './Pages/Frontpage';
import gothamNarrow from '../assets/Gotham-Narrow-Font-Family/GothamNarrow-Book.otf';
import EndPage from './Pages/EndPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';
import Logout from './Components/Logout';
import BMCPage from './Pages/BMC';
import BMCBlockEditor from './Components/BMC/BMCBlockEditor';

function App() {
  const myFontFace = `
    @font-face {
      font-family: 'Gotham Narrow';
      src: url(${gothamNarrow}) format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: 'Gotham Narrow', sans-serif;
    }
  `;

  return (
    <>
      <style>
        {myFontFace}
      </style>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<FrontPage />} />
          <Route path="/bmc" element={<BMCPage />}>
            <Route path=":blockId" element={<BMCBlockEditor />} />
          </Route>
          <Route path="/endpage" element={<EndPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

