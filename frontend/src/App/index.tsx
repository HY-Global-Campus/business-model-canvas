import { Routes, Route } from 'react-router-dom';
import Mindmap from "./Pages/Mindmap"
import FrontPage from './Pages/Frontpage';
import ExercisePage from './Pages/ExercisePage';
import gothamNarrow from '../assets/Gotham-Narrow-Font-Family/GothamNarrow-Book.otf'
import { CSSProperties } from 'react';

function App() {
const myFontFace = `
  @font-face {
    font-family: 'Gotham Narrow';
    src: url(${gothamNarrow}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }
`;

const textStyle: CSSProperties = {
  fontFamily: "'Gotham Narrow', sans-serif",
};  
  return (
    <>
    <style>
      {myFontFace}
    </style>
    <div style={textStyle}>
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/mindmap" element={ <Mindmap />} />
      <Route path="/exercise" element= {<ExercisePage />} />
    </Routes>
    </div>
    </>
  );
}

export default App;

