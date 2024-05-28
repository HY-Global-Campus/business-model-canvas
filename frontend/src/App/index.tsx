import { Routes, Route } from 'react-router-dom';
import Mindmap from "./Pages/Mindmap"
import FrontPage from './Pages/Frontpage';
import ExercisePage from './Pages/ExercisePage';
import gothamNarrow from '../assets/Gotham-Narrow-Font-Family/GothamNarrow-Book.otf'
import EndPage from './Pages/EndPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';

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
      <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<FrontPage />} />
          <Route path="/mindmap" element={ <Mindmap />} />
          <Route path="/exercise" element= {<ExercisePage />} />
          <Route path="/endpage" element= {<EndPage />} />
      </Route>
    </Routes>

    </>
  );
}

export default App;

