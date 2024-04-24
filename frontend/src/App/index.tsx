import { Routes, Route } from 'react-router-dom';
import Mindmap from "./Pages/Mindmap"
import FrontPage from './Pages/Frontpage';
import ExercisePage from './Pages/ExercisePage';
import gothamNarrow from '../assets/Gotham-Narrow-Font-Family/GothamNarrow-Book.otf'

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
      <Route path="/" element={<FrontPage />} />
      <Route path="/mindmap" element={ <Mindmap />} />
      <Route path="/exercise" element= {<ExercisePage />} />
    </Routes>

    </>
  );
}

export default App;

